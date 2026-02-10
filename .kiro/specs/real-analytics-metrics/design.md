# Design Document: Real Analytics Metrics

## Overview

This design document outlines the implementation of real-time analytics calculations for the MoneyPilot PWA. The system will replace all hardcoded mock data with computed metrics derived from actual transaction, budget, and auto expense data stored in the application state.

The analytics system will be implemented as a collection of custom React hooks and utility functions that leverage React's memoization capabilities for optimal performance. All calculations will use precise integer arithmetic to avoid floating-point errors in financial computations.

### Key Design Principles

1. **Real-time Reactivity**: All metrics update instantly when underlying data changes
2. **Performance Optimization**: Memoization prevents unnecessary recalculations
3. **Financial Precision**: Integer arithmetic in cents prevents floating-point errors
4. **Composability**: Small, focused hooks that can be combined
5. **Type Safety**: Full TypeScript coverage with strict types
6. **Testability**: Pure functions that are easy to test

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│              (Dashboard, Budgets, Auto, etc.)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ useAnalytics hooks
                     │
┌────────────────────▼────────────────────────────────────┐
│                Analytics Hooks Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ useWeekly    │  │ useBudget    │  │ useAuto      │ │
│  │ Trend        │  │ Analytics    │  │ Metrics      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ calls
                     │
┌────────────────────▼────────────────────────────────────┐
│              Core Calculation Functions                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Date         │  │ Financial    │  │ Aggregation  │ │
│  │ Utilities    │  │ Math         │  │ Functions    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ reads from
                     │
┌────────────────────▼────────────────────────────────────┐
│                  App Store (Zustand-like)                │
│         transactions, budgets, autoExpenses              │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Updates app store (add/edit/delete transaction)
2. **Store Update** → Triggers React re-render
3. **Component Re-render** → Calls analytics hooks
4. **Hooks** → Check memoization dependencies
5. **If Changed** → Recalculate metrics using core functions
6. **If Unchanged** → Return cached results
7. **Component** → Renders with updated metrics

## Components and Interfaces

### Core Types

```typescript
// Date range for filtering transactions
interface DateRange {
  start: Date;
  end: Date;
}

// Weekly trend result
interface WeeklyTrend {
  currentWeek: number;
  previousWeek: number;
  percentageChange: number | null;
  direction: 'up' | 'down' | 'neutral';
}

// Budget health status
type BudgetHealth = 'on-track' | 'warning' | 'overspent';

// Category analytics
interface CategoryAnalytics {
  id: number;
  name: string;
  used: number;
  limit: number;
  utilizationPercent: number;
  percentOfTotal: number;
  health: BudgetHealth;
  color: string;
}

// Income vs expense summary
interface IncomeExpenseSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number | null;
}

// Auto metrics
interface AutoMetrics {
  totalMonthlyExpenses: number;
  costPerKm: number | null;
  averageFuelCost: number;
  fuelTransactionCount: number;
}

// Transaction group by date
interface TransactionGroup {
  date: string; // ISO format YYYY-MM-DD
  displayDate: string; // Localized display
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

// Chart data format
interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}
```

### Custom Hooks API

#### useWeeklyTrend

```typescript
function useWeeklyTrend(): WeeklyTrend
```

Calculates spending trend comparing current week to previous week.

**Returns**: WeeklyTrend object with current/previous amounts and percentage change

**Dependencies**: transactions array from store

**Memoization**: useMemo with transactions as dependency

#### useDailyBudget

```typescript
function useDailyBudget(): number
```

Calculates recommended daily spending based on remaining budget and days left in month.

**Returns**: Daily budget amount (whole number)

**Dependencies**: budgets array from store, current date

**Memoization**: useMemo with budgets and current day as dependencies

#### useCategoryAnalytics

```typescript
function useCategoryAnalytics(): CategoryAnalytics[]
```

Computes detailed analytics for each budget category.

**Returns**: Array of CategoryAnalytics sorted by spending amount (descending)

**Dependencies**: budgets array from store

**Memoization**: useMemo with budgets as dependency

#### useIncomeExpenseSummary

```typescript
function useIncomeExpenseSummary(period?: DateRange): IncomeExpenseSummary
```

Calculates income vs expense summary for a given period.

**Parameters**:
- `period` (optional): Date range to filter transactions. Defaults to current month.

**Returns**: IncomeExpenseSummary with totals and savings rate

**Dependencies**: transactions array, period

**Memoization**: useMemo with transactions and period as dependencies

#### useTransactionGroups

```typescript
function useTransactionGroups(): TransactionGroup[]
```

Groups transactions by date for organized display.

**Returns**: Array of TransactionGroup sorted by date (newest first)

**Dependencies**: transactions array, locale from store

**Memoization**: useMemo with transactions and locale as dependencies

#### useAutoMetrics

```typescript
function useAutoMetrics(distanceKm?: number): AutoMetrics
```

Calculates vehicle expense metrics.

**Parameters**:
- `distanceKm` (optional): Total kilometers driven. If not provided, costPerKm will be null.

**Returns**: AutoMetrics with TCO, cost per km, and fuel statistics

**Dependencies**: autoExpenses array, distanceKm

**Memoization**: useMemo with autoExpenses and distanceKm as dependencies

#### useBudgetHealth

```typescript
function useBudgetHealth(): BudgetHealth
```

Determines overall budget health status.

**Returns**: Worst health status among all categories

**Dependencies**: budgets array

**Memoization**: useMemo with budgets as dependency

#### useChartData

```typescript
function useChartData(type: 'weekly' | 'category' | 'trend'): ChartData
```

Formats analytics data for chart components.

**Parameters**:
- `type`: Type of chart data to generate

**Returns**: ChartData formatted for the specified chart type

**Dependencies**: Varies by chart type (transactions, budgets, etc.)

**Memoization**: useMemo with appropriate dependencies

## Data Models

### Financial Precision Model

All currency amounts will be stored and calculated in cents (smallest currency unit) to avoid floating-point precision errors.

```typescript
// Utility functions for financial math
class FinancialMath {
  // Convert currency units to cents
  static toCents(amount: number): number {
    return Math.round(amount * 100);
  }
  
  // Convert cents to currency units
  static fromCents(cents: number): number {
    return cents / 100;
  }
  
  // Add amounts in cents
  static add(a: number, b: number): number {
    return a + b;
  }
  
  // Subtract amounts in cents
  static subtract(a: number, b: number): number {
    return a - b;
  }
  
  // Calculate percentage
  static percentage(part: number, whole: number): number {
    if (whole === 0) return 0;
    return (part / whole) * 100;
  }
  
  // Format for display
  static format(cents: number, locale: string, currency: string): string {
    const amount = FinancialMath.fromCents(cents);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
```

### Date Handling Model

```typescript
// Utility functions for date operations
class DateUtils {
  // Get ISO week boundaries (Monday to Sunday)
  static getWeekBoundaries(date: Date): DateRange {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { start: monday, end: sunday };
  }
  
  // Get current month boundaries
  static getMonthBoundaries(date: Date): DateRange {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }
  
  // Get days remaining in month
  static getDaysRemainingInMonth(date: Date): number {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const currentDay = date.getDate();
    return lastDay - currentDay + 1;
  }
  
  // Parse transaction date string to Date object
  static parseTransactionDate(dateStr: string): Date {
    // Handle Russian date formats like "Сегодня", "Вчера", or actual dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateStr === "Сегодня" || dateStr === "Today") {
      return today;
    }
    
    if (dateStr === "Вчера" || dateStr === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    
    // Try parsing as date string
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    
    // Fallback to today if unparseable
    return today;
  }
  
  // Format date for display
  static formatForDisplay(date: Date, locale: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - compareDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return locale === 'ru-RU' ? 'Сегодня' : 'Today';
    if (diffDays === 1) return locale === 'ru-RU' ? 'Вчера' : 'Yesterday';
    
    return date.toLocaleDateString(locale, { 
      day: 'numeric', 
      month: 'long' 
    });
  }
  
  // Check if date is in range
  static isInRange(date: Date, range: DateRange): boolean {
    return date >= range.start && date <= range.end;
  }
}
```

### Transaction Filtering Model

```typescript
// Utility functions for filtering transactions
class TransactionFilters {
  // Filter by date range
  static byDateRange(transactions: Transaction[], range: DateRange): Transaction[] {
    return transactions.filter(t => {
      const date = DateUtils.parseTransactionDate(t.date);
      return DateUtils.isInRange(date, range);
    });
  }
  
  // Filter by type
  static byType(transactions: Transaction[], type: TxType): Transaction[] {
    return transactions.filter(t => t.type === type);
  }
  
  // Filter by current week
  static currentWeek(transactions: Transaction[]): Transaction[] {
    const range = DateUtils.getWeekBoundaries(new Date());
    return TransactionFilters.byDateRange(transactions, range);
  }
  
  // Filter by previous week
  static previousWeek(transactions: Transaction[]): Transaction[] {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const range = DateUtils.getWeekBoundaries(lastWeek);
    return TransactionFilters.byDateRange(transactions, range);
  }
  
  // Filter by current month
  static currentMonth(transactions: Transaction[]): Transaction[] {
    const range = DateUtils.getMonthBoundaries(new Date());
    return TransactionFilters.byDateRange(transactions, range);
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Weekly Expense Calculation

*For any* set of transactions and any week (defined by start and end dates), the calculated total expense for that week should equal the sum of all expense-type transactions whose dates fall within that week's boundaries.

**Validates: Requirements 1.1, 1.2**

### Property 2: Percentage Change Calculation

*For any* two non-zero numeric values representing previous and current amounts, the calculated percentage change should equal ((current - previous) / previous) * 100.

**Validates: Requirements 1.3**

### Property 3: ISO Week Boundaries

*For any* date, the calculated week boundaries should start on Monday at 00:00:00 and end on Sunday at 23:59:59, following ISO 8601 week date standard.

**Validates: Requirements 1.6**

### Property 4: Remaining Budget Calculation

*For any* set of budget categories, the total remaining budget should equal the sum of (limit - used) for all categories.

**Validates: Requirements 2.1**

### Property 5: Days Remaining Calculation

*For any* date within a month, the calculated days remaining should equal (last day of month - current day + 1).

**Validates: Requirements 2.2**

### Property 6: Daily Budget Formula

*For any* positive remaining budget and positive days remaining, the daily budget should equal remaining budget divided by days remaining, rounded to the nearest whole number.

**Validates: Requirements 2.3, 2.6**

### Property 7: Category Utilization Percentage

*For any* budget category with non-zero limit, the utilization percentage should equal (used / limit) * 100, rounded to one decimal place.

**Validates: Requirements 3.1, 3.6**

### Property 8: Category Spending Percentages Sum

*For any* set of budget categories with non-zero total spending, the sum of all individual category spending percentages should equal 100% (within rounding tolerance of 0.1%).

**Validates: Requirements 3.2**

### Property 9: Category Sort Order

*For any* set of budget categories, when sorted by the analytics system, each category's used amount should be greater than or equal to the next category's used amount (descending order).

**Validates: Requirements 3.5**

### Property 10: Budget Health Classification

*For any* budget category, the health status should be "on-track" when utilization < 70%, "warning" when 70% ≤ utilization ≤ 100%, and "overspent" when utilization > 100%.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 11: Overall Budget Health Aggregation

*For any* set of budget categories with varying health statuses, the overall health should be "overspent" if any category is overspent, otherwise "warning" if any is warning, otherwise "on-track".

**Validates: Requirements 4.5**

### Property 12: Transaction Type Summation

*For any* set of transactions, date range, and transaction type (income or expense), the calculated total should equal the sum of all transaction amounts matching that type within the date range.

**Validates: Requirements 5.1, 5.2**

### Property 13: Net Balance Calculation

*For any* total income and total expense amounts, the net balance should equal income minus expense.

**Validates: Requirements 5.3**

### Property 14: Savings Rate Formula

*For any* non-zero income and net balance, the savings rate should equal (net balance / income) * 100.

**Validates: Requirements 5.4**

### Property 15: Date Range Filtering

*For any* set of transactions and any date range (current week, current month, or custom), the filtered transactions should include only those whose parsed dates fall within the range boundaries.

**Validates: Requirements 5.6**

### Property 16: Date Normalization

*For any* parsed transaction date, the normalized date should have time components set to 00:00:00.000 for consistent grouping.

**Validates: Requirements 6.2**

### Property 17: ISO Date Format Keys

*For any* transaction group, the group key should match the ISO 8601 date format pattern YYYY-MM-DD.

**Validates: Requirements 6.3**

### Property 18: Transaction Group Sort Order

*For any* set of transaction groups, when sorted by the analytics system, each group's date should be more recent than or equal to the next group's date (descending chronological order).

**Validates: Requirements 6.4**

### Property 19: Transaction Order Preservation

*For any* transaction group, the order of transactions within that group should match their order in the original input array (stable sort).

**Validates: Requirements 6.5**

### Property 20: Invalid Date Handling

*For any* transaction with an unparseable date string, that transaction should be placed in a group with key "Invalid Date" rather than causing an error.

**Validates: Requirements 6.6**

### Property 21: Auto Expense TCO Calculation

*For any* set of auto expenses, the Total Cost of Ownership should equal the sum of all expense amounts.

**Validates: Requirements 7.1**

### Property 22: Cost Per Kilometer Formula

*For any* non-zero total auto expenses and non-zero distance in kilometers, the cost per km should equal (total expenses / distance), rounded to two decimal places.

**Validates: Requirements 7.2, 7.5**

### Property 23: Fuel Average Calculation

*For any* set of fuel-related transactions, the average fuel cost should equal the sum of fuel transaction amounts divided by the count of fuel transactions.

**Validates: Requirements 7.3**

### Property 24: Fuel Transaction Identification

*For any* transaction whose title contains fuel-related keywords (e.g., "бензин", "fuel", "gas", "АЗС"), that transaction should be classified as a fuel expense.

**Validates: Requirements 7.6**

### Property 25: Memoization Consistency

*For any* analytics calculation function, when called multiple times with identical input dependencies, the function should return the same result without re-executing the calculation logic.

**Validates: Requirements 8.2, 8.3, 8.5**

### Property 26: Shared Calculation Reuse

*For any* set of analytics functions that depend on the same base calculation (e.g., total expenses), that base calculation should be computed once and reused across all dependent functions.

**Validates: Requirements 8.6**

### Property 27: Integer Arithmetic Precision

*For any* currency calculation, when performed using integer arithmetic in cents, the result should be mathematically exact without floating-point rounding errors.

**Validates: Requirements 9.1, 9.5**

### Property 28: Currency Display Conversion

*For any* amount stored in cents, when converted for display, the result should equal the cent value divided by 100, formatted with appropriate decimal places for the currency.

**Validates: Requirements 9.2**

### Property 29: Division by Zero Handling

*For any* calculation involving division, when the denominator is zero, the function should return null or zero (as appropriate for the context) rather than throwing an error or returning Infinity/NaN.

**Validates: Requirements 9.4**

### Property 30: Locale-Based Formatting

*For any* numeric value and locale setting, the formatted output should follow the number formatting conventions of that locale (decimal separator, thousands separator, currency symbol placement).

**Validates: Requirements 9.6**

### Property 31: Chart Data Array Consistency

*For any* chart data object (bar, line, or pie chart), all arrays within the object (labels, values, colors, etc.) should have the same length.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

### Property 32: Chart Data Sort Order

*For any* chart data, the data should be sorted in the most meaningful order for that chart type: chronological ascending for line charts, descending by value for bar charts, descending by percentage for pie charts.

**Validates: Requirements 10.6**

## Error Handling

### Error Handling Strategy

The analytics system will use a defensive programming approach with graceful degradation:

1. **Invalid Dates**: Return fallback values (current date or "Invalid Date" group)
2. **Division by Zero**: Return null or 0 depending on context
3. **Missing Data**: Return empty arrays or null values, never undefined
4. **Invalid Numbers**: Treat as 0 or filter out of calculations
5. **Locale Errors**: Fall back to default locale (en-US)

### Error Handling Patterns

```typescript
// Safe division with null return
function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

// Safe date parsing with fallback
function safeDateParse(dateStr: string): Date {
  try {
    const parsed = DateUtils.parseTransactionDate(dateStr);
    if (isNaN(parsed.getTime())) {
      return new Date(); // Fallback to current date
    }
    return parsed;
  } catch {
    return new Date(); // Fallback to current date
  }
}

// Safe array access with default
function safeArrayAccess<T>(arr: T[], index: number, defaultValue: T): T {
  return arr[index] ?? defaultValue;
}

// Safe number parsing
function safeParseNumber(value: unknown): number {
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}
```

### Error Boundaries

For React components using analytics hooks:

```typescript
// Error boundary wrapper for analytics components
class AnalyticsErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    console.error('Analytics calculation error:', error);
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      // Render fallback UI with mock data or empty state
      return <AnalyticsFallback />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The analytics system will be tested using both unit tests and property-based tests:

**Unit Tests** will cover:
- Specific examples demonstrating correct behavior
- Edge cases (zero values, empty arrays, invalid dates)
- Error conditions (division by zero, null inputs)
- Integration between hooks and store
- React hook behavior (memoization, re-rendering)

**Property-Based Tests** will cover:
- Universal properties that hold for all inputs
- Mathematical correctness (formulas, percentages, aggregations)
- Data transformations (filtering, grouping, sorting)
- Invariants (array lengths, sum properties, order preservation)

### Property-Based Testing Configuration

**Library**: We will use **fast-check** for TypeScript property-based testing.

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: real-analytics-metrics, Property N: [property description]`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';

describe('Feature: real-analytics-metrics', () => {
  it('Property 1: Weekly Expense Calculation', () => {
    // Feature: real-analytics-metrics, Property 1: Weekly expense calculation
    fc.assert(
      fc.property(
        fc.array(transactionArbitrary),
        fc.date(),
        (transactions, date) => {
          const weekRange = DateUtils.getWeekBoundaries(date);
          const calculated = calculateWeeklyExpenses(transactions, weekRange);
          const expected = transactions
            .filter(t => t.type === 'expense')
            .filter(t => {
              const txDate = DateUtils.parseTransactionDate(t.date);
              return DateUtils.isInRange(txDate, weekRange);
            })
            .reduce((sum, t) => sum + t.amount, 0);
          
          expect(calculated).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Data Generators

Custom arbitraries for property-based testing:

```typescript
// Generate random transactions
const transactionArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  amount: fc.integer({ min: 1, max: 1000000 }), // In cents
  type: fc.constantFrom('income', 'expense'),
  date: fc.date().map(d => d.toISOString()),
});

// Generate random budgets
const budgetArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  used: fc.integer({ min: 0, max: 100000 }),
  limit: fc.integer({ min: 1, max: 100000 }),
});

// Generate random auto expenses
const autoExpenseArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.constantFrom('Бензин', 'Парковка', 'Мойка', 'Ремонт'),
  amount: fc.integer({ min: 100, max: 50000 }),
  date: fc.date().map(d => d.toLocaleDateString('ru-RU')),
});
```

### Unit Test Coverage

Unit tests will be organized by module:

1. **Date Utilities** (`date-utils.test.ts`)
   - Week boundary calculations
   - Month boundary calculations
   - Days remaining calculations
   - Date parsing and formatting
   - Edge cases: leap years, month boundaries, timezones

2. **Financial Math** (`financial-math.test.ts`)
   - Cent conversion (to/from)
   - Addition and subtraction
   - Percentage calculations
   - Formatting with different locales
   - Edge cases: negative numbers, zero, very large numbers

3. **Transaction Filters** (`transaction-filters.test.ts`)
   - Date range filtering
   - Type filtering
   - Current week/month filtering
   - Edge cases: empty arrays, invalid dates

4. **Analytics Hooks** (`analytics-hooks.test.ts`)
   - Each hook's basic functionality
   - Memoization behavior
   - Re-render optimization
   - Integration with store
   - Edge cases: empty data, null values

### Integration Testing

Integration tests will verify:
- End-to-end data flow from store to UI
- Multiple hooks working together
- Store updates triggering recalculations
- Performance under realistic data volumes

### Performance Testing

Performance benchmarks will ensure:
- Calculations complete within 100ms for typical data volumes
- Memoization prevents unnecessary recalculations
- No memory leaks from hook dependencies
- Efficient handling of large transaction arrays (1000+ items)

## Implementation Notes

### File Structure

```
src/lib/
├── analytics/
│   ├── hooks/
│   │   ├── useWeeklyTrend.ts
│   │   ├── useDailyBudget.ts
│   │   ├── useCategoryAnalytics.ts
│   │   ├── useIncomeExpenseSummary.ts
│   │   ├── useTransactionGroups.ts
│   │   ├── useAutoMetrics.ts
│   │   ├── useBudgetHealth.ts
│   │   └── useChartData.ts
│   ├── utils/
│   │   ├── date-utils.ts
│   │   ├── financial-math.ts
│   │   └── transaction-filters.ts
│   ├── types.ts
│   └── index.ts
└── app-store.tsx
```

### Implementation Order

1. **Core Utilities** (date-utils, financial-math, transaction-filters)
2. **Basic Hooks** (useWeeklyTrend, useDailyBudget)
3. **Category Analytics** (useCategoryAnalytics, useBudgetHealth)
4. **Income/Expense** (useIncomeExpenseSummary)
5. **Transaction Grouping** (useTransactionGroups)
6. **Auto Metrics** (useAutoMetrics)
7. **Chart Data** (useChartData)
8. **Integration** (update all pages to use new hooks)

### Migration Strategy

To minimize disruption, the migration will be gradual:

1. **Phase 1**: Implement core utilities and basic hooks
2. **Phase 2**: Update Dashboard page to use new hooks
3. **Phase 3**: Update Budgets page
4. **Phase 4**: Update Auto page
5. **Phase 5**: Update Transactions page
6. **Phase 6**: Remove all hardcoded mock data

Each phase will be tested independently before moving to the next.

### Performance Considerations

1. **Memoization**: All hooks use `useMemo` with proper dependencies
2. **Shared Calculations**: Common calculations (like total expenses) are computed once
3. **Lazy Evaluation**: Chart data only calculated when needed
4. **Efficient Filtering**: Use native array methods optimized by JS engines
5. **Integer Math**: Faster than floating-point operations

### Accessibility Considerations

1. **Number Formatting**: Respect user's locale for number display
2. **Screen Readers**: Ensure calculated values have proper ARIA labels
3. **Color Independence**: Don't rely solely on color for budget health status
4. **Keyboard Navigation**: All interactive analytics elements keyboard accessible

### Localization Support

The analytics system will support multiple locales:

- **Date Formatting**: Use `Intl.DateTimeFormat` with user's locale
- **Number Formatting**: Use `Intl.NumberFormat` with user's locale
- **Currency Display**: Respect currency symbol placement per locale
- **Relative Dates**: Support "Today"/"Сегодня" in multiple languages

### Future Enhancements

Potential future improvements:

1. **Historical Trends**: Track metrics over multiple months
2. **Predictive Analytics**: Forecast future spending based on trends
3. **Goal Tracking**: Compare actual vs. target spending
4. **Category Recommendations**: Suggest budget adjustments
5. **Export Functionality**: Export analytics data to CSV/PDF
6. **Comparison Mode**: Compare current month to previous months
7. **Custom Date Ranges**: User-defined date range selection
8. **Advanced Filters**: Filter by amount range, category, keywords
