#include "Polynomial.h"
#include <iostream>
#include <cmath>

using namespace std;

Polynomial::Polynomial() {
    head = nullptr;
}

Polynomial::~Polynomial() {
    clear();
}

void Polynomial::clear() {
    Node* current = head;

    while (current != nullptr) {
        Node* temp = current;
        current = current->next;
        delete temp;
    }

    head = nullptr;
}

void Polynomial::insertTerm(int coefficient, int exponent) {
    if (coefficient == 0) {
        return;
    }

    Node* current = head;
    Node* previous = nullptr;

    // Maintain descending order of exponents
    while (current != nullptr &&
           current->exponent > exponent) {

        previous = current;
        current = current->next;
    }

    // Merge like terms
    if (current != nullptr &&
        current->exponent == exponent) {

        current->coefficient += coefficient;

        // Remove zero coefficient node
        if (current->coefficient == 0) {

            if (previous == nullptr) {
                head = current->next;
            } else {
                previous->next = current->next;
            }

            delete current;
        }

        return;
    }

    Node* newNode = new Node(coefficient, exponent);

    if (previous == nullptr) {
        newNode->next = head;
        head = newNode;
    } else {
        newNode->next = current;
        previous->next = newNode;
    }
}

void Polynomial::display() const {
    if (head == nullptr) {
        cout << "0";
        return;
    }

    Node* current = head;
    bool firstTerm = true;

    while (current != nullptr) {

        int coefficient = current->coefficient;
        int exponent = current->exponent;

        if (!firstTerm) {
            if (coefficient > 0) {
                cout << " + ";
            } else {
                cout << " - ";
                coefficient = -coefficient;
            }
        } else if (coefficient < 0) {
            cout << "-";
            coefficient = -coefficient;
        }

        if (exponent == 0) {
            cout << coefficient;
        } else if (exponent == 1) {

            if (coefficient != 1) {
                cout << coefficient;
            }

            cout << "x";

        } else {

            if (coefficient != 1) {
                cout << coefficient;
            }

            cout << "x^" << exponent;
        }

        firstTerm = false;
        current = current->next;
    }
}

Polynomial Polynomial::add(
    const Polynomial& other) const {

    Polynomial result;

    Node* current = head;

    while (current != nullptr) {

        result.insertTerm(
            current->coefficient,
            current->exponent
        );

        current = current->next;
    }

    current = other.head;

    while (current != nullptr) {

        result.insertTerm(
            current->coefficient,
            current->exponent
        );

        current = current->next;
    }

    return result;
}

Polynomial Polynomial::subtract(
    const Polynomial& other) const {

    Polynomial result;

    Node* current = head;

    while (current != nullptr) {

        result.insertTerm(
            current->coefficient,
            current->exponent
        );

        current = current->next;
    }

    current = other.head;

    while (current != nullptr) {

        result.insertTerm(
            -current->coefficient,
            current->exponent
        );

        current = current->next;
    }

    return result;
}

Polynomial Polynomial::multiply(
    const Polynomial& other) const {

    Polynomial result;

    Node* first = head;

    while (first != nullptr) {

        Node* second = other.head;

        while (second != nullptr) {

            int coefficient =
                first->coefficient *
                second->coefficient;

            int exponent =
                first->exponent +
                second->exponent;

            result.insertTerm(
                coefficient,
                exponent
            );

            second = second->next;
        }

        first = first->next;
    }

    return result;
}

Polynomial Polynomial::derivative() const {

    Polynomial result;

    Node* current = head;

    while (current != nullptr) {

        if (current->exponent > 0) {

            result.insertTerm(
                current->coefficient *
                current->exponent,

                current->exponent - 1
            );
        }

        current = current->next;
    }

    return result;
}

double Polynomial::evaluate(int x) const {

    double result = 0;

    Node* current = head;

    while (current != nullptr) {

        result += current->coefficient *
                  pow(x, current->exponent);

        current = current->next;
    }

    return result;
}

int Polynomial::getDegree() const {

    if (head == nullptr) {
        return 0;
    }

    return head->exponent;
}

int Polynomial::getTermCount() const {

    int count = 0;

    Node* current = head;

    while (current != nullptr) {

        count++;
        current = current->next;
    }

    return count;
}

void Polynomial::displayLinkedList() const {

    if (head == nullptr) {

        cout << "NULL\n";
        return;
    }

    Node* current = head;

    cout << "\nLinked List Representation:\n\n";

    while (current != nullptr) {

        cout << "[ Coeff: "
             << current->coefficient

             << " | Exp: "
             << current->exponent

             << " ]";

        if (current->next != nullptr) {
            cout << " -> ";
        }

        current = current->next;
    }

    cout << " -> NULL\n";
}