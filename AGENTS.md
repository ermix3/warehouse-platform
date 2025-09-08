## Data model (entities & key fields)

> Entities you requested:

Category
Customer
Supplier
Product
Order
Shipping

### Schemas (add fields as needed):

`Category`
id
name
description (nullable)
created_at / updated_at

`Customer`
id
name
email
phone
address
notes (nullable)
created_at / updated_at

`Supplier`
id
name
email
phone
address
notes
created_at / updated_at

`Product`
id
sku (unique)
name
description
category_id (FK)
supplier_id (FK, nullable)
price (decimal)
cost (decimal, nullable)
stock_quantity (integer)
reorder_point (integer)
created_at / updated_at

`Order`
id
customer_id (FK)
order_number (unique)
status (enum: draft, pending, confirmed, shipped, delivered, cancelled)
total (decimal)
placed_at (datetime nullable)
created_at / updated_at

`Order_Item` (pivot)
id
order_id
product_id
quantity
unit_price
line_total

`Shipping`
id
order_id (FK)
tracking_number
carrier
shipped_at (datetime)
status (enum: pending, in_transit, delivered, returned)
cost (decimal)
created_at / updated_at

### Relations
Audit / Inventory transactions (recommended)
stock_movements: id, product_id, change (int), reason, reference_id, created_at
