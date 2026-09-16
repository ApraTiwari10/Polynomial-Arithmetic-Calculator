#ifndef POLYNOMIAL_H
#define POLYNOMIAL_H

#include "Node.h"

class Polynomial {
private:
    Node* head;

public:
    Polynomial();
    ~Polynomial();

    // Core Polynomial Operations
    void insertTerm(int coefficient, int exponent);
    void display() const;

    Polynomial add(const Polynomial& other) const;
    Polynomial subtract(const Polynomial& other) const;
    Polynomial multiply(const Polynomial& other) const;

    // Advanced Polynomial Operations
    Polynomial derivative() const;
    double evaluate(int x) const;

    // Polynomial Information
    int getDegree() const;
    int getTermCount() const;

    // Linked List Visualization
    void displayLinkedList() const;

    // Memory Management
    void clear();
};

#endif