# Implementation Plan: Real Analytics Metrics

## Overview

This implementation plan converts the hardcoded mock analytics in MoneyPilot into real-time calculations based on actual transaction data. The implementation follows a bottom-up approach: first building core utilities, then analytics hooks, and finally integrating them into the UI components. Each task includes property-based tests to ensure correctness.

## Tasks

- [x] 1. Set up analytics module structure and core types
  - Create `src/lib/analytics/` directory structure
  - Create `src/lib/analytics/types.ts` with all TypeScript interfaces
  - Create `src/lib/analytics/index.ts` for exports
  - Set up fast-check testing library for property-based tests
  - _Requirements: All requirements (foundational)_

- [ ] 2. Implement Financial Math utilities
  - [x] 2.1 Create `src/lib/analytics/utils/financial-math.ts`
    - Implement `FinancialMath` class with toCents, fromCents, add, subtract, percentage, format methods
    - Use integer arithmetic for all currency operations
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6_
  
  - [ ]* 2.2 Write property test for currency conversion round trip
    - **Property 27: Integer Arithmetic Precision**
    - **Validates: Requirements 9.1, 9.5**
  
  - [ ]* 2.3 Write property test for locale-based formatting
    - **Property 30: Locale-Based Formatting**
    - **Validates: Requirements 9.6**
  
  - [ ]* 2.4 Write unit tests for financial math edge cases
    - Test negative numbers, zero, very large numbers
    - Test division by zero handling
    - _Requirements: 9.4_

- [ ] 3. Implement Date utilities
  - [x] 3.1 Create `src/lib/analytics/utils/date-utils.ts`
    - Implement `DateUtils` class with getWeekBoundaries, getMonthBoundaries, getDaysRemainingInMonth methods
    - Implement parseTransactionDate, formatForDisplay, isInRange methods
    - Handle Russian date strings ("Сегодня", "Вчера")
    - _Requirements: 1.6, 2.2, 6.1, 6.2_
  
  - [ ]* 3.2 Write property test for ISO week boundaries
    - **Property 3: ISO Week Boundaries**
    - **Validates: Requirements 1.6**
  
  - [ ]* 3.3 Write property test for days remaining calculation
    - **Property 5: Days Remaining Calculation**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.4 Write property test for date normalization
    - **Property 16: Date Normalization**
    - **Validates: Requirements 6.2**
  
  - [ ]* 3.5 Write unit tests for date edge cases
    - Test leap years, month boundaries, invalid dates
    - Test Russian date string parsing
    - _Requirements: 6.1, 6.6_

- [ ] 4. Implement Transaction Filter utilities
  - [ ] 4.1 Create `src/lib/analytics/utils/transaction-filters.ts`
    - Implement `TransactionFilters` class with byDateRange, byType, currentWeek, previousWeek, currentMonth methods
    - _Requirements: 5.6, 1.1, 1.2_
  
  - [ ]* 4.2 Write property test for date range filtering
    - **Property 15: Date Range Filtering**
    - **Validates: Requirements 5.6**
  
  - [ ]* 4.3 Write property test for transaction type summation
    - **Property 12: Transaction Type Summation**
    - **Validates: Requirements 5.1, 5.2**

- [ ] 5. Checkpoint - Ensure all utility tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Weekly Trend hook
  - [x] 6.1 Create `src/lib/analytics/hooks/useWeeklyTrend.ts`
    - Implement useWeeklyTrend hook using useMemo
    - Calculate current and previous week expenses
    - Calculate percentage change with null handling for zero previous week
    - Format percentage with sign and rounding
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 6.2 Write property test for weekly expense calculation
    - **Property 1: Weekly Expense Calculation**
    - **Validates: Requirements 1.1, 1.2**
  
  - [ ]* 6.3 Write property test for percentage change calculation
    - **Property 2: Percentage Change Calculation**
    - **Validates: Requirements 1.3**
  
  - [ ]* 6.4 Write unit test for zero previous week edge case
    - Test that null is returned when previous week has zero expenses
    - _Requirements: 1.4_

- [ ] 7. Implement Daily Budget hook
  - [x] 7.1 Create `src/lib/analytics/hooks/useDailyBudget.ts`
    - Implement useDailyBudget hook using useMemo
    - Calculate total remaining budget across all categories
    - Calculate days remaining in current month
    - Apply daily budget formula with edge case handling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 7.2 Write property test for remaining budget calculation
    - **Property 4: Remaining Budget Calculation**
    - **Validates: Requirements 2.1**
  
  - [ ]* 7.3 Write property test for daily budget formula
    - **Property 6: Daily Budget Formula**
    - **Validates: Requirements 2.3, 2.6**
  
  - [ ]* 7.4 Write unit tests for daily budget edge cases
    - Test negative remaining budget returns zero
    - Test zero/negative days remaining returns full remaining budget
    - _Requirements: 2.4, 2.5_

- [ ] 8. Implement Category Analytics hook
  - [ ] 8.1 Create `src/lib/analytics/hooks/useCategoryAnalytics.ts`
    - Implement useCategoryAnalytics hook using useMemo
    - Calculate utilization percentage for each category
    - Calculate percentage of total spending for each category
    - Sort categories by spending amount descending
    - Handle zero limit and zero total spending edge cases
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 8.2 Write property test for category utilization percentage
    - **Property 7: Category Utilization Percentage**
    - **Validates: Requirements 3.1, 3.6**
  
  - [ ]* 8.3 Write property test for spending percentages sum
    - **Property 8: Category Spending Percentages Sum**
    - **Validates: Requirements 3.2**
  
  - [ ]* 8.4 Write property test for category sort order
    - **Property 9: Category Sort Order**
    - **Validates: Requirements 3.5**
  
  - [ ]* 8.5 Write unit tests for category edge cases
    - Test zero limit returns 100% utilization when used > 0
    - Test zero total spending returns 0% for all categories
    - _Requirements: 3.3, 3.4_

- [ ] 9. Implement Budget Health hook
  - [ ] 9.1 Create `src/lib/analytics/hooks/useBudgetHealth.ts`
    - Implement useBudgetHealth hook using useMemo
    - Classify each category health based on utilization thresholds
    - Determine overall health as worst status among all categories
    - Define color codes for each health status
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 9.2 Write property test for budget health classification
    - **Property 10: Budget Health Classification**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [ ]* 9.3 Write property test for overall health aggregation
    - **Property 11: Overall Budget Health Aggregation**
    - **Validates: Requirements 4.5**
  
  - [ ]* 9.4 Write unit test for health color codes
    - Test that each health status maps to correct color
    - _Requirements: 4.4_

- [ ] 10. Checkpoint - Ensure budget analytics tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement Income Expense Summary hook
  - [ ] 11.1 Create `src/lib/analytics/hooks/useIncomeExpenseSummary.ts`
    - Implement useIncomeExpenseSummary hook with optional period parameter
    - Calculate total income and total expense for period
    - Calculate net balance (income - expense)
    - Calculate savings rate with null handling for zero income
    - Support current week, current month, and custom date ranges
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 11.2 Write property test for net balance calculation
    - **Property 13: Net Balance Calculation**
    - **Validates: Requirements 5.3**
  
  - [ ]* 11.3 Write property test for savings rate formula
    - **Property 14: Savings Rate Formula**
    - **Validates: Requirements 5.4**
  
  - [ ]* 11.4 Write unit test for zero income edge case
    - Test that null is returned for savings rate when income is zero
    - _Requirements: 5.5_

- [ ] 12. Implement Transaction Groups hook
  - [ ] 12.1 Create `src/lib/analytics/hooks/useTransactionGroups.ts`
    - Implement useTransactionGroups hook using useMemo
    - Parse and normalize transaction dates
    - Group transactions by ISO date format (YYYY-MM-DD)
    - Sort groups by date descending (newest first)
    - Preserve transaction order within each group
    - Handle invalid dates with special "Invalid Date" group
    - Calculate totals for each group
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 12.2 Write property test for ISO date format keys
    - **Property 17: ISO Date Format Keys**
    - **Validates: Requirements 6.3**
  
  - [ ]* 12.3 Write property test for transaction group sort order
    - **Property 18: Transaction Group Sort Order**
    - **Validates: Requirements 6.4**
  
  - [ ]* 12.4 Write property test for transaction order preservation
    - **Property 19: Transaction Order Preservation**
    - **Validates: Requirements 6.5**
  
  - [ ]* 12.5 Write property test for invalid date handling
    - **Property 20: Invalid Date Handling**
    - **Validates: Requirements 6.6**

- [ ] 13. Implement Auto Metrics hook
  - [ ] 13.1 Create `src/lib/analytics/hooks/useAutoMetrics.ts`
    - Implement useAutoMetrics hook with optional distanceKm parameter
    - Calculate total monthly auto expenses (TCO)
    - Calculate cost per km with null handling for missing distance
    - Identify fuel transactions by keyword matching
    - Calculate average fuel cost
    - Round cost per km to two decimal places
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 13.2 Write property test for TCO calculation
    - **Property 21: Auto Expense TCO Calculation**
    - **Validates: Requirements 7.1**
  
  - [ ]* 13.3 Write property test for cost per km formula
    - **Property 22: Cost Per Kilometer Formula**
    - **Validates: Requirements 7.2, 7.5**
  
  - [ ]* 13.4 Write property test for fuel average calculation
    - **Property 23: Fuel Average Calculation**
    - **Validates: Requirements 7.3**
  
  - [ ]* 13.5 Write property test for fuel transaction identification
    - **Property 24: Fuel Transaction Identification**
    - **Validates: Requirements 7.6**
  
  - [ ]* 13.6 Write unit test for missing distance edge case
    - Test that null is returned for cost per km when distance is not provided
    - _Requirements: 7.4_

- [ ] 14. Implement Chart Data hook
  - [ ] 14.1 Create `src/lib/analytics/hooks/useChartData.ts`
    - Implement useChartData hook with chart type parameter
    - Format data for bar charts (labels and values arrays)
    - Format data for line charts (x-axis dates and y-axis amounts)
    - Format data for pie charts (category names and percentages)
    - Ensure all arrays have matching lengths
    - Return empty arrays for no data (not null)
    - Sort data appropriately for each chart type
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 14.2 Write property test for chart data array consistency
    - **Property 31: Chart Data Array Consistency**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
  
  - [ ]* 14.3 Write property test for chart data sort order
    - **Property 32: Chart Data Sort Order**
    - **Validates: Requirements 10.6**
  
  - [ ]* 14.4 Write unit test for empty data edge case
    - Test that empty arrays are returned when no data available
    - _Requirements: 10.5_

- [ ] 15. Checkpoint - Ensure all analytics hooks tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Integrate analytics into Dashboard page
  - [x] 16.1 Update `src/app/page.tsx` to use analytics hooks
    - Replace hardcoded weekly trend with useWeeklyTrend hook
    - Replace hardcoded daily budget with useDailyBudget hook
    - Replace hardcoded available budget calculation with useCategoryAnalytics
    - Update progress bar to use real budget utilization data
    - Remove all mock data and calculations
    - _Requirements: 1.1-1.6, 2.1-2.6, 3.1-3.6_
  
  - [ ]* 16.2 Write integration test for Dashboard analytics
    - Test that dashboard displays correct metrics from store data
    - Test that metrics update when store data changes
    - _Requirements: 8.1, 8.2_

- [ ] 17. Integrate analytics into Budgets page
  - [ ] 17.1 Update `src/app/budgets/page.tsx` to use analytics hooks
    - Replace hardcoded category calculations with useCategoryAnalytics hook
    - Use useBudgetHealth for health indicators
    - Use useIncomeExpenseSummary for income/expense totals
    - Update chart visualization with real data
    - Remove all mock calculations
    - _Requirements: 3.1-3.6, 4.1-4.5, 5.1-5.6_
  
  - [ ]* 17.2 Write integration test for Budgets page analytics
    - Test that budget categories display correct utilization percentages
    - Test that health indicators update correctly
    - _Requirements: 8.1, 8.2_

- [ ] 18. Integrate analytics into Auto page
  - [ ] 18.1 Update `src/app/auto/page.tsx` to use analytics hooks
    - Replace hardcoded total with useAutoMetrics hook
    - Display cost per km if distance data available
    - Display average fuel cost
    - Display fuel efficiency metrics
    - Remove all mock calculations
    - _Requirements: 7.1-7.6_
  
  - [ ]* 18.2 Write integration test for Auto page analytics
    - Test that auto metrics display correctly
    - Test that metrics update when auto expenses change
    - _Requirements: 8.1, 8.2_

- [ ] 19. Integrate analytics into Transactions page
  - [x] 19.1 Update `src/app/transactions/page.tsx` to use analytics hooks
    - Replace hardcoded date grouping with useTransactionGroups hook
    - Display transactions grouped by date with proper formatting
    - Show daily totals for each group
    - Remove all mock date handling
    - _Requirements: 6.1-6.6_
  
  - [ ]* 19.2 Write integration test for Transactions page analytics
    - Test that transactions are grouped correctly by date
    - Test that group totals are calculated correctly
    - _Requirements: 8.1, 8.2_

- [ ] 20. Add memoization optimization tests
  - [ ]* 20.1 Write property test for memoization consistency
    - **Property 25: Memoization Consistency**
    - **Validates: Requirements 8.2, 8.3, 8.5**
  
  - [ ]* 20.2 Write property test for shared calculation reuse
    - **Property 26: Shared Calculation Reuse**
    - **Validates: Requirements 8.6**
  
  - [ ]* 20.3 Write performance benchmark tests
    - Test that calculations complete within 100ms for typical data
    - Test that memoization prevents unnecessary recalculations
    - _Requirements: 8.1_

- [ ] 21. Add division by zero safety tests
  - [ ]* 21.1 Write property test for division by zero handling
    - **Property 29: Division by Zero Handling**
    - **Validates: Requirements 9.4**
  
  - [ ]* 21.2 Write unit tests for all division operations
    - Test safeDivide function with zero denominators
    - Test percentage calculations with zero totals
    - Test cost per km with zero distance
    - _Requirements: 9.4_

- [ ] 22. Final checkpoint - End-to-end testing
  - [ ]* 22.1 Write end-to-end integration tests
    - Test complete data flow from store update to UI display
    - Test multiple pages updating simultaneously
    - Test performance with large datasets (1000+ transactions)
    - _Requirements: 8.1, 8.2, 8.6_
  
  - [ ] 22.2 Manual testing checklist
    - Verify all pages display real data (no hardcoded values)
    - Verify metrics update instantly when data changes
    - Verify all edge cases handled gracefully (empty data, zero values)
    - Verify locale formatting works correctly
    - Verify mobile responsiveness maintained
    - _Requirements: All requirements_

- [ ] 23. Documentation and cleanup
  - [ ] 23.1 Add JSDoc comments to all analytics functions and hooks
    - Document parameters, return types, and usage examples
    - Document edge case behavior
    - _Requirements: All requirements_
  
  - [ ] 23.2 Update README with analytics architecture
    - Document analytics module structure
    - Document available hooks and their usage
    - Document testing approach
    - _Requirements: All requirements_
  
  - [ ] 23.3 Remove any remaining mock data or hardcoded calculations
    - Search codebase for hardcoded numbers
    - Remove unused mock data variables
    - Clean up commented-out code
    - _Requirements: All requirements_

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end data flow and UI updates
- Implementation follows bottom-up approach: utilities → hooks → UI integration
