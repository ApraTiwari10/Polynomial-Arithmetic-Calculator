#include "Polynomial.h"
#include <iostream>

using namespace std;

void createPolynomial(Polynomial& polynomial, char name) {
    int numberOfTerms;

    cout << "\nEnter number of terms for Polynomial "
         << name << ": ";
    cin >> numberOfTerms;

    cout << "\nEnter coefficient and exponent for each term:\n";

    for (int i = 0; i < numberOfTerms; i++) {
        int coefficient;
        int exponent;

        cout << "\nTerm " << i + 1 << " coefficient: ";
        cin >> coefficient;

        cout << "Term " << i + 1 << " exponent: ";
        cin >> exponent;

        polynomial.insertTerm(coefficient, exponent);
    }
}

void displayPolynomialInformation(
    const Polynomial& polynomial,
    char name) {

    cout << "\n\n----------------------------------------";
    cout << "\nPolynomial " << name << " Information";
    cout << "\n----------------------------------------";

    cout << "\nPolynomial: ";
    polynomial.display();

    cout << "\nDegree: "
         << polynomial.getDegree();

    cout << "\nNumber of Terms: "
         << polynomial.getTermCount();

    polynomial.displayLinkedList();
}

int main() {

    Polynomial polynomialA;
    Polynomial polynomialB;

    int choice;

    cout << "========================================\n";
    cout << "     POLYNOMIAL ARITHMETIC CALCULATOR\n";
    cout << "========================================\n";

    cout << "\nCreate Polynomial A";
    createPolynomial(polynomialA, 'A');

    cout << "\n\nCreate Polynomial B";
    createPolynomial(polynomialB, 'B');

    do {

        cout << "\n\n========================================";
        cout << "\n              MAIN MENU";
        cout << "\n========================================";

        cout << "\n\nPolynomial A: ";
        polynomialA.display();

        cout << "\nPolynomial B: ";
        polynomialB.display();

        cout << "\n\n1. Addition";
        cout << "\n2. Subtraction";
        cout << "\n3. Multiplication";
        cout << "\n4. Derivative of Polynomial A";
        cout << "\n5. Evaluate Polynomial A";
        cout << "\n6. Display Polynomial Information";
        cout << "\n7. Display Linked List";
        cout << "\n8. Exit";

        cout << "\n\nEnter your choice: ";
        cin >> choice;

        switch (choice) {

        case 1: {

            Polynomial result =
                polynomialA.add(polynomialB);

            cout << "\n\nResult of Addition: ";
            result.display();

            break;
        }

        case 2: {

            Polynomial result =
                polynomialA.subtract(polynomialB);

            cout << "\n\nResult of Subtraction: ";
            result.display();

            break;
        }

        case 3: {

            Polynomial result =
                polynomialA.multiply(polynomialB);

            cout << "\n\nResult of Multiplication: ";
            result.display();

            break;
        }

        case 4: {

            Polynomial result =
                polynomialA.derivative();

            cout << "\n\nDerivative of Polynomial A: ";
            result.display();

            break;
        }

        case 5: {

            int x;

            cout << "\n\nEnter value of x: ";
            cin >> x;

            double result =
                polynomialA.evaluate(x);

            cout << "\nP(" << x << ") = "
                 << result;

            break;
        }

        case 6:

            displayPolynomialInformation(
                polynomialA,
                'A'
            );

            displayPolynomialInformation(
                polynomialB,
                'B'
            );

            break;

        case 7:

            cout << "\n\nPolynomial A Linked List:";
            polynomialA.displayLinkedList();

            cout << "\n\nPolynomial B Linked List:";
            polynomialB.displayLinkedList();

            break;

        case 8:

            cout << "\n\nThank you for using "
                 << "Polynomial Calculator!\n";

            break;

        default:

            cout << "\n\nInvalid choice."
                 << " Please try again.";
        }

    } while (choice != 8);

    return 0;
}