INSERT INTO breve_inquiry (
  firstname, lastname, email, comment, date, phone, typeofproj
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
