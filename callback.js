const url = new URL(location.href);

const payload = {
  type: url.searchParams.get("type"),
  email: url.searchParams.get("email"),
  password: url.searchParams.get("password"),
};

if (payload.type === "register") {
  /** @type {any[]} */
  const registeredAccounts = JSON.parse(
    localStorage.getItem("registeredAccounts") ?? "[]"
  );

  const hash = new jsSHA("SHA-512", "TEXT", { numRounds: 1 });
  hash.update(payload.password);
  const data = {
    email: payload.email,
    password: hash.getHash("HEX"),
  };

  const accIdx = registeredAccounts.findIndex((v) => v.email === data.email);
  if (accIdx !== -1) registeredAccounts[accIdx] = data;
  else registeredAccounts.push(data);

  localStorage.setItem(
    "registeredAccounts",
    JSON.stringify(registeredAccounts)
  );

  Cookies.set("user", btoa(JSON.stringify(data)));

  location.href = "./";
}

if (payload.type === "login") {
  /** @type {any[]} */
  const registeredAccounts = JSON.parse(
    localStorage.getItem("registeredAccounts") ?? "[]"
  );

  const hash = new jsSHA("SHA-512", "TEXT", { numRounds: 1 });
  hash.update(payload.password);
  const data = {
    email: payload.email,
    password: hash.getHash("HEX"),
  };

  const acc = registeredAccounts.find((v) => v.email === data.email);
  if (acc) {
    if (acc.password === data.password) {
      Cookies.set("user", btoa(JSON.stringify(data)));
      location.href = "./";
    } else location.href = `login.html?e=INVALID_PASSWORD&m=${data.email}`;
  } else location.href = `login.html?e=INVALID_EMAIL&m=${data.email}`;
}
