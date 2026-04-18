# Security Specification - Shamiyat Kiosk

## Data Invariants
1. A menu item must have a name, category, price, and image.
2. An order must have an order number, items list, total, status, and type.
3. Only authorized users (Admin) can modify the menu.
4. Anyone can browse the menu (Read-only).
5. Anyone can place an order (Create-only).
6. Only authorized users (Admin) can view and update orders.

## The Dirty Dozen Payloads

### Menu Collection
1. **Shadow Update**: Add `isAdmin: true` to a menu item.
2. **Identity Spoofing**: Attempt to create a menu item as a non-admin.
3. **Invalid Price**: Create a menu item with a negative price.
4. **Invalid Category**: Create a menu item with a category not in the enum.

### Orders Collection
5. **Direct Status Update**: A customer trying to update their order status to "completed".
6. **Price Tampering**: Submitting an order with a total of 0.01 MAD while containing expensive items.
7. **Order Injection**: Injecting a 1MB string into the orderNumber field.
8. **Relational Sync Failure**: Creating an order without any items.
9. **Identity Poisoning**: Creating an order with a malicious document ID.
10. **Admin Bypass**: Trying to read all orders as a standard/unauthenticated user.
11. **Terminal State Lock Break**: Trying to update a "completed" order back to "pending".
12. **Timestamp Spoofing**: Submitting a future date as `createdAt`.
