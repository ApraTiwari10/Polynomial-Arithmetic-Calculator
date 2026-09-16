#ifndef NODE_H
#define NODE_H

class Node {
public:
    int coefficient;
    int exponent;
    Node* next;

    Node(int coeff, int exp) {
        coefficient = coeff;
        exponent = exp;
        next = nullptr;
    }
};

#endif