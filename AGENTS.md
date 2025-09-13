## Data model (entities & key fields)

> Entities:

Category
Customer
Supplier
Shipping
Product
Order

### Schemas (add fields as needed):

`Category`
id
name
description (nullable)
created_at / updated_at

`Customer`
id
name
email (nullable, unique)
phone (nullable)
address (nullable)
notes (nullable)
created_at / updated_at

`Supplier`
id
name // TODO: should be unique
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
net_weight
box_weight
category_id (FK) ->  Remplacer par HSCODE
supplier_id (FK, nullable) ->  Remplacer par origine
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
unit_price
order_id
product_id
created_at / updated_at
