# CIT506 Assessment 2: KiwiSaver Lump Sum Investment Calculator
# This programme calculates compound interest on a one-off KiwiSaver lump sum.

# Specify UTF-8 encoding to support standard text and special characters
# -*- coding: utf-8 -*-
"""
KiwiSaver Lump Sum Investment Calculator

Calculates the growth of a one-off KiwiSaver lump sum using
annual return rates of 4%, 6%, and 8% over a period of 1 to 45 years.
"""

# Import system functions to allow controlled program termination
import sys


# ============================================================
# WELCOME MESSAGE
# ============================================================

# Display programme purpose to the user
print("\nWelcome to the KiwiSaver Lump Sum Investment Calculator!")
print("This program estimates the growth of a one-off KiwiSaver deposit.\n")
print("Enter a deposit amount and an investment period to calculate")
print("returns at 4%, 6%, and 8%.\n")


# ============================================================
# INPUT: LUMP SUM DEPOSIT
# ============================================================

# Repeat until a valid deposit amount is entered
while True:
    print()
    deposit_input = input(
        "Enter deposit amount (e.g., 5000 or $12,000.50): "
    )

    # Remove formatting characters before conversion
    deposit_input = (
        deposit_input
        .replace(",", "")
        .replace("$", "")
        .strip()
    )

    # Convert input to a floating-point number
    try:
        deposit = float(deposit_input)
    except ValueError:
        print("Invalid deposit. Please enter a numeric value.")
        continue

    # Deposit must be greater than zero
    if deposit <= 0:
        print("Deposit must be greater than 0.")
        continue

    # Limit deposit to two decimal places
    if deposit != round(deposit, 2):
        print("Deposit can only have up to 2 decimal places.")
        continue

    # Prevent invalid leading zero formats (e.g., 05)
    if (
        deposit_input.startswith("0")
        and not deposit_input.startswith("0.")
        and len(deposit_input) > 1
    ):
        print("Invalid format. Number cannot begin with 0.")
        continue

    break


# ============================================================
# INPUT: NUMBER OF YEARS
# ============================================================

# Repeat until a valid number of years is entered
while True:
    print()
    years_input = input(
        "Enter number of years (1 to 45): "
    ).strip()

    # Convert input to an integer
    try:
        years = int(years_input)
    except ValueError:
        print("Invalid years. Please enter a whole number.")
        continue

    # Ensure the value is within the allowed range
    if years < 1 or years > 45:
        print("Years must be between 1 and 45.")
        continue

    break


# ============================================================
# DECISION: YEAR-BY-YEAR BREAKDOWN
# ============================================================

# Ask the user whether they want a detailed breakdown
while True:
    print()
    breakdown_choice = input(
        "Would you like a year-by-year breakdown? (Yes/No): "
    ).strip().lower()

    if breakdown_choice in ("yes", "y"):
        breakdown_choice = "yes"
        break

    if breakdown_choice in ("no", "n"):
        breakdown_choice = "no"
        break

    print("Please enter Yes or No (y/n).")


# ============================================================
# PROCESS: COMPOUND INTEREST CALCULATIONS
# ============================================================

# Store interest rates and corresponding fund names
rates = {
    "4": 0.04,
    "6": 0.06,
    "8": 0.08
}

fund_names = {
    "4": "Conservative",
    "6": "Balanced",
    "8": "Growth"
}

results = {}

# Calculate compound interest for each fund option
for rate_key, annual_rate in rates.items():

    balance = deposit
    year = 1

    # Apply interest for each year of the investment period
    while year <= years:
        balance += balance * annual_rate
        year += 1

    # Store final totals for summary output
    results[rate_key] = {
        "total_interest": balance - deposit,
        "ending_balance": balance
    }


# ============================================================
# OUTPUT: SUMMARY RESULTS
# ============================================================

# Display a summary table for all fund types
print("\nKIWISAVER INVESTMENT SUMMARY\n")

print("+----------------+------+----------------------+----------------------+")
print(
    f"| {'Fund Type':^14} | "
    f"{'Rate':^4} | "
    f"{'Total Interest':^20} | "
    f"{'Ending Balance':^20} |"
)
print("+----------------+------+----------------------+----------------------+")

for key in ("4", "6", "8"):
    print(
        f"| {fund_names[key]:<14} | {(key + '%'):^4} | "
        f"{('$' + format(results[key]['total_interest'], ',.2f')):^20} | "
        f"{('$' + format(results[key]['ending_balance'], ',.2f')):^20} |"
    )

print("+----------------+------+----------------------+----------------------+")


# ============================================================
# OUTPUT: YEAR-BY-YEAR BREAKDOWN
# ============================================================

# Display a detailed breakdown if requested
if breakdown_choice == "yes":

    while True:
        print()
        rate_choice = input(
            "Select rate for breakdown (4, 6, or 8): "
        ).strip()

        if rate_choice not in rates:
            print("Please enter 4, 6, or 8.")
            continue

        annual_rate = rates[rate_choice]
        balance = deposit
        year = 1

        print("\nYEAR-BY-YEAR BREAKDOWN")
        print(f"Rate: {rate_choice}%\n")

        print("+------+----------------------+----------------------+----------------------+")
        print(
            f"| {'Year':^4} | "
            f"{'Starting Balance':^20} | "
            f"{'Interest Earned':^20} | "
            f"{'Ending Balance':^20} |"
        )
        print("+------+----------------------+----------------------+----------------------+")

        # Calculate and display each year
        while year <= years:
            starting_balance = balance
            interest_earned = starting_balance * annual_rate
            balance += interest_earned

            print(
                f"| {year:^4} | "
                f"{('$' + format(starting_balance, ',.2f')):^20} | "
                f"{('$' + format(interest_earned, ',.2f')):^20} | "
                f"{('$' + format(balance, ',.2f')):^20} |"
            )

            year += 1

        print("+------+----------------------+----------------------+----------------------+")

        # Ask if the user wants to view another breakdown
        while True:
            print()
            again = input(
                "Would you like to view another rate? (Yes/No): "
            ).strip().lower()

            if again in ("yes", "y"):
                break

            if again in ("no", "n"):
                print(
                    "\nThank you for using the "
                    "KiwiSaver Lump Sum Investment Calculator!"
                )
                sys.exit()

            print("Please enter Yes or No (y/n).")


# ============================================================
# PROGRAM END
# ============================================================

# Final message when the programme completes
print(
    "\nThank you for using the "
    "KiwiSaver Lump Sum Investment Calculator!"
)
sys.exit()
