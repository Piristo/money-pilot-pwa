# Implementation Plan: Auto Module Upgrade

## Overview

This implementation plan breaks down the Auto Module Upgrade into incremental coding tasks. Each task builds on previous work, with property-based tests placed close to implementation to catch errors early. The implementation uses TypeScript/React with Zustand for state management, Recharts for visualizations, and Framer Motion for animations.

## Tasks

- [x] 1. Set up Auto module foundation and type definitions
  - Create `src/lib/auto/types.ts` with all TypeScript types (CarProfile, FuelLog, MaintenanceLog, AutoExpenseCategory, Reminder)
  - Create `src/lib/auto/categories.ts` with category definitions, icons, and colors
  - Export helper functions: `getCategoryById`, `getCategoryColor`, `getCategoryIcon`
  - _Requirements: 2.1, 2.4_

- [x] 2. Extend app store with Auto module state and actions
  - [x] 2.1 Add new state fields to `src/lib/app-store.tsx`
    - Add carProfile, fuelLogs, maintenanceLogs, autoReminders to StoreState
    - Update STORAGE_KEY to "money-pilot-store-v2"
    - Implement storage migration from v1 to v2
    - _Requirements: 7.1, 8.2, 8.4_
  
  - [x] 2.2 Implement car profile actions
    - Add setCarProfile, updateCarMileage, updateFuelPrice actions
    - Add validation for year, mileage, fuelConsumption, tankCapacity
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 2.3 Write property test for car profile validation
    - **Property 15: Input Validation Rules**
    - **Validates: Requirements 7.4, 7.5, 7.6, 7.7**
  
  - [x] 2.4 Implement fuel log actions
    - Add addFuelLog, updateFuelLog, deleteFuelLog actions
    - Auto-calculate pricePerLiter in addFuelLog: amount / liters
    - _Requirements: 3.1, 3.2_
  
  - [ ]* 2.5 Write property test for fuel log persistence and price calculation
    - **Property 5: Data Persistence Round Trip**
    - **Property 6: Price Per Liter Auto-Calculation**
    - **Validates: Requirements 3.1, 3.2, 8.2**
  
  - [x] 2.6 Implement maintenance log actions
    - Add addMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog actions
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 2.7 Write property test for maintenance log persistence
    - **Property 5: Data Persistence Round Trip**
    - **Validates: Requirements 4.1, 8.2**
  
  - [x] 2.8 Implement reminder actions
    - Add addReminder, updateReminder, deleteReminder, completeReminder actions
    - Implement createRecurringReminder logic for next occurrence
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7_
  
  - [ ]* 2.9 Write property test for recurring reminder next occurrence
    - **Property 11: Recurring Reminder Next Occurrence**
    - **Validates: Requirements 5.7**

- [ ] 3. Checkpoint - Verify store implementation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement fuel consumption calculator
  - [x] 4.1 Create `src/lib/auto/fuel-calculator.ts`
    - Implement calculateRealConsumption function
    - Filter full-tank logs, sort by date, calculate consumption between consecutive pairs
    - Implement getAverageConsumption function
    - _Requirements: 1.2, 3.3_
  
  - [ ]* 4.2 Write property test for fuel consumption calculation
    - **Property 2: Real Fuel Consumption Calculation**
    - **Validates: Requirements 1.2, 3.3**
  
  - [ ]* 4.3 Write unit tests for edge cases
    - Test with no full-tank logs (should return empty array)
    - Test with single full-tank log (should return empty array)
    - Test with zero mileage difference (should skip data point)
    - _Requirements: 3.3_

- [x] 5. Implement metrics calculator
  - [x] 5.1 Create `src/lib/auto/metrics.ts`
    - Implement calculateCostPerKm function
    - Implement calculateMonthlyForecast function
    - Implement calculateMetrics function (returns VehicleMetrics object)
    - Handle division by zero (return 0 or null)
    - _Requirements: 1.1, 1.3, 1.4, 1.5_
  
  - [ ]* 5.2 Write property test for metric calculations
    - **Property 1: Metric Calculations Are Mathematically Correct**
    - **Validates: Requirements 1.1, 1.4, 1.5**
  
  - [ ]* 5.3 Write property test for monthly forecast
    - **Property 3: Monthly Forecast Based on Historical Average**
    - **Validates: Requirements 1.3**
  
  - [ ]* 5.4 Write unit tests for edge cases
    - Test with no data (should return zeros or nulls)
    - Test with zero mileage (should handle division by zero)
    - _Requirements: 1.1, 1.3_

- [ ] 6. Implement reminder system utilities
  - [x] 6.1 Create `src/lib/auto/reminders.ts`
    - Implement getReminderStatus function (calculate remaining days/km, check if overdue)
    - Implement sortRemindersByUrgency function
    - _Requirements: 5.1, 5.2, 5.4, 5.5_
  
  - [ ]* 6.2 Write property test for reminder calculations
    - **Property 10: Reminder Remaining Time Calculation**
    - **Property 12: Overdue Reminder Detection**
    - **Validates: Requirements 5.1, 5.2, 5.4, 5.5**

- [ ] 7. Checkpoint - Verify business logic
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Create UI components for metrics and charts
  - [x] 8.1 Create `src/components/auto/MetricsCard.tsx`
    - Glassmorphism card with icon, label, value, unit, optional trend
    - Use Design System V2 styles
    - Add hover effect with cursor-pointer
    - _Requirements: 6.1_
  
  - [x] 8.2 Create `src/components/auto/FuelChart.tsx`
    - Line chart using Recharts
    - Display consumption data points over time
    - Optional manufacturer spec line (dashed)
    - Tooltip with date and consumption
    - Smooth animations with Framer Motion
    - _Requirements: 3.6, 6.4_
  
  - [x] 8.3 Create `src/components/auto/ExpenseCategoryChart.tsx`
    - Pie chart using Recharts
    - Color slices by category color
    - Tooltip with category name, amount, percentage
    - Legend with category icons
    - _Requirements: 2.3, 6.3_
  
  - [ ]* 8.4 Write property test for expense category percentages
    - **Property 4: Expense Category Percentages Sum to 100%**
    - **Validates: Requirements 2.3**
  
  - [ ]* 8.5 Write unit tests for chart components
    - Test MetricsCard renders with correct props
    - Test FuelChart renders with data points
    - Test ExpenseCategoryChart renders with categories
    - _Requirements: 6.1, 6.3, 6.4_

- [ ] 9. Create form components for data entry
  - [x] 9.1 Create `src/components/auto/FuelLogForm.tsx`
    - Form fields: date, liters, amount, mileage, fuelType, station, fullTank
    - Validation: all required except station, liters > 0, amount > 0, mileage >= 0
    - Warning for future date or mileage < previous
    - Auto-calculate and display price per liter
    - _Requirements: 3.1, 3.2, 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 9.2 Create `src/components/auto/MaintenanceLogForm.tsx`
    - Form fields: date, type, category, description, amount, mileage, workshop, nextServiceMileage, nextServiceDate
    - Validation: required fields, amount > 0, mileage >= 0
    - Warning for future date or mileage < previous
    - Validation for next service mileage > current, next service date > current
    - _Requirements: 4.1, 4.2, 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 9.3 Write property test for form validation
    - **Property 15: Input Validation Rules**
    - **Property 16: Required Field Validation**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
  
  - [x] 9.4 Create `src/components/auto/ReminderCard.tsx`
    - Display reminder title, status, remaining time/km
    - Red border if overdue
    - Complete button (checkmark icon)
    - Delete button (trash icon)
    - Smooth hover and click animations
    - _Requirements: 5.4, 5.5, 5.6_

- [ ] 10. Implement Auto dashboard page
  - [x] 10.1 Create `src/app/auto/page.tsx`
    - Display 4 metric cards: monthly expenses, avg consumption, cost per km, monthly mileage
    - Display line chart of expenses by month (12 months)
    - Display pie chart of expense distribution by category
    - Display line chart of fuel consumption trend
    - Responsive layout for mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_
  
  - [ ]* 10.2 Write property test for dashboard chart data consistency
    - **Property 14: Dashboard Chart Data Consistency**
    - **Validates: Requirements 6.2, 6.3, 6.4**
  
  - [ ]* 10.3 Write unit tests for dashboard
    - Test dashboard renders with no data (empty state)
    - Test dashboard renders with sample data
    - Test metric cards display correct values
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 11. Implement fuel log page
  - [ ] 11.1 Create `src/app/auto/fuel/page.tsx`
    - Display fuel logs in reverse chronological order
    - Add button to open FuelLogForm
    - Display fuel statistics: avg cost, avg frequency
    - Display FuelChart with consumption trend
    - Display price history chart
    - _Requirements: 3.4, 3.5, 3.6, 3.7_
  
  - [ ]* 11.2 Write property test for fuel log sorting
    - **Property 7: Reverse Chronological Sorting**
    - **Validates: Requirements 3.4**
  
  - [ ]* 11.3 Write property test for fuel statistics
    - **Property 8: Fuel Statistics Calculations**
    - **Validates: Requirements 3.5, 3.6, 3.7**

- [ ] 12. Implement maintenance log page
  - [ ] 12.1 Create `src/app/auto/maintenance/page.tsx`
    - Display maintenance logs in reverse chronological order
    - Add button to open MaintenanceLogForm
    - Display cost breakdown by category
    - Display frequency of service types
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 12.2 Write property test for maintenance log sorting
    - **Property 7: Reverse Chronological Sorting**
    - **Validates: Requirements 4.3**
  
  - [ ]* 12.3 Write property test for maintenance cost breakdown
    - **Property 9: Maintenance Cost Breakdown Totals**
    - **Validates: Requirements 4.4**

- [ ] 13. Implement car settings page
  - [x] 13.1 Create `src/app/auto/settings/page.tsx`
    - Form to configure car profile: brand, model, year, mileage, fuelConsumption, fuelType, tankCapacity, fuelPrice
    - Validation for all fields
    - Save button to persist to store
    - Display current car profile if exists
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 13.2 Write unit tests for settings page
    - Test form validation
    - Test save action updates store
    - Test load existing profile
    - _Requirements: 7.1, 7.2_

- [ ] 14. Checkpoint - Verify all pages and components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement error handling and edge cases
  - [ ] 15.1 Add error handling for storage operations
    - Wrap localStorage.setItem in try-catch for QuotaExceededError
    - Wrap localStorage.getItem and JSON.parse in try-catch for corrupted data
    - Display user notifications for errors
    - _Requirements: 8.1, 8.3_
  
  - [ ] 15.2 Add empty state handling
    - Display "Нет данных" message when no logs exist
    - Display prompts to add first record
    - Display "Недостаточно данных" for calculations requiring multiple records
    - _Requirements: 1.2, 3.3_
  
  - [ ]* 15.3 Write unit tests for error handling
    - Test storage quota exceeded
    - Test corrupted storage data
    - Test empty state rendering
    - _Requirements: 8.3_

- [ ] 16. Add animations and polish UI
  - [ ] 16.1 Add Framer Motion animations to all components
    - Card hover effects with scale
    - Form submission feedback
    - Chart entrance animations
    - Page transitions
    - Animation duration: 150-300ms
    - _Requirements: 9.3, 9.5_
  
  - [ ] 16.2 Verify Design System V2 compliance
    - Check glassmorphism styles on all cards
    - Verify gradient accents
    - Check color contrast ratios (4.5:1 minimum)
    - Verify responsive layout on mobile
    - _Requirements: 9.4, 6.6_
  
  - [ ] 16.3 Add accessibility features
    - ARIA labels for all interactive elements
    - Keyboard navigation support
    - Focus indicators
    - Screen reader support
    - _Requirements: Technical Constraints - Accessibility_

- [ ] 17. Final integration and testing
  - [ ] 17.1 Wire all components together
    - Ensure navigation between pages works
    - Ensure forms update store correctly
    - Ensure charts reflect store data
    - Ensure reminders display on dashboard
    - _Requirements: All_
  
  - [ ]* 17.2 Write integration tests
    - Test complete user flow: add fuel log → view dashboard → see updated metrics
    - Test complete user flow: add maintenance → view maintenance page → see in list
    - Test complete user flow: create reminder → mark complete → verify next occurrence
    - _Requirements: All_
  
  - [ ]* 17.3 Run all property-based tests
    - Verify all 16 properties pass with 100+ iterations
    - Fix any failures
    - _Requirements: All_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- All text in Russian, currency in rubles (₽)
- Design follows Design System V2 with glassmorphism aesthetics
- TypeScript for type safety, Recharts for charts, Framer Motion for animations
