## Data model (entities & key fields)

> Entities:

Customer
Supplier
Shipping
Product
Order

### Schemas (add fields as needed):

`Customer`
id
code // TODO: should be unique
name
email (nullable, unique)
phone (nullable)
address (nullable)
notes (nullable)
created_at / updated_at

`Supplier`
id
code // TODO: should be unique
name
email (nullable) // TODO: should be unique
phone (nullable)
address (nullable)
notes (nullable)
created_at / updated_at

`Shipping`
id
tracking_number (nullable)
carrier (nullable)
status (enum: pending, in_transit, delivered, returned)
total (decimal)
created_at / updated_at

`Product`
id
barcode (unique)
name
description (nullable)
origin
hs_code
unit_price
box_qtt
height
length
width
net_weight
box_weight
supplier_id (FK, nullable)
created_at / updated_at

`Order`
id
order_number (unique)
status (enum: draft, pending, confirmed, shipped, delivered, cancelled)
total (decimal) 
customer_id (FK)
shipping_id (FK)
created_at / updated_at

`Order_Item` (pivot)
id
quantity
ctn
order_id
product_id
created_at / updated_at
