INSERT INTO gfg_contactmessages (
  name, email, details, date
)
VALUES ($1, $2, $3, $4)
RETURNING *
;
