#!/bin/bash

# Automated test script for Seconde Main

echo "=========================================="
echo "Seconde Main - Automated Tests"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local description=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    local expected_status=${5:-200}
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    status=$(echo "$response" | tail -n1)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED (Status: $status, Expected: $expected_status)${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Test 1: Health checks
echo ""
echo "=== Health Checks ==="
test_endpoint "API Gateway health" "http://localhost:4000/health"
test_endpoint "User Service health" "http://localhost:4001/health"
test_endpoint "Search Service health" "http://localhost:4002/health"
test_endpoint "Scraper Service health" "http://localhost:4003/health"

# Test 2: Populate database
echo ""
echo "=== Database Population ==="
test_endpoint "Populate database" "http://localhost:4000/api/scraper/run" "POST" ""

# Wait for indexing
echo "⏳ Waiting for Elasticsearch to index products..."
sleep 3

# Test 3: Product search
echo ""
echo "=== Product Search ==="
test_endpoint "Search all products" "http://localhost:4000/api/search"
test_endpoint "Search by category" "http://localhost:4000/api/search?category=electronics"
test_endpoint "Search by price range" "http://localhost:4000/api/search?minPrice=100&maxPrice=500"
test_endpoint "Search by condition" "http://localhost:4000/api/search?condition=excellent"
test_endpoint "Search by location" "http://localhost:4000/api/search?location=Paris"

# Test 4: User registration
echo ""
echo "=== User Management ==="
USER_EMAIL="test-$(date +%s)@example.com"
REGISTER_DATA="{\"email\":\"$USER_EMAIL\",\"password\":\"password123\",\"name\":\"Test User\"}"
register_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$REGISTER_DATA" "http://localhost:4000/api/auth/register")

if echo "$register_response" | grep -q "token"; then
    echo -e "Testing: User registration... ${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "Testing: User registration... ${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Test 5: User login
echo ""
echo "=== Authentication ==="
LOGIN_DATA="{\"email\":\"$USER_EMAIL\",\"password\":\"password123\"}"
login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$LOGIN_DATA" "http://localhost:4000/api/auth/login")

if echo "$login_response" | grep -q "token"; then
    echo -e "Testing: User login... ${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Testing: User login... ${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Test 6: Favorites (if we have a token)
if [ ! -z "$TOKEN" ]; then
    echo ""
    echo "=== Favorites Management ==="
    
    # Add to favorites
    FAVORITE_DATA='{"productId":"product-1","productData":{"title":"Test Product","price":100}}'
    favorite_response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$FAVORITE_DATA" "http://localhost:4000/api/favorites")
    status=$(echo "$favorite_response" | tail -n1)
    
    if [ "$status" = "201" ]; then
        echo -e "Testing: Add to favorites... ${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Testing: Add to favorites... ${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Get favorites
    favorites_response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/favorites")
    status=$(echo "$favorites_response" | tail -n1)
    
    if [ "$status" = "200" ]; then
        echo -e "Testing: Get favorites... ${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Testing: Get favorites... ${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
    
    # Remove from favorites
    remove_response=$(curl -s -w "\n%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/favorites/product-1")
    status=$(echo "$remove_response" | tail -n1)
    
    if [ "$status" = "200" ]; then
        echo -e "Testing: Remove from favorites... ${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Testing: Remove from favorites... ${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
fi

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
