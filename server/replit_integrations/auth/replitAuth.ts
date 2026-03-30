import session from "express-session";
import createMemoryStore from "memorystore";
import type { Express, RequestHandler } from "express";
import { User } from "../../models/User";

const MemoryStore = createMemoryStore(session);

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "lfis-dev-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86_400_000 }),
    cookie: {
      httpOnly: true,
      secure: false,    // false for local HTTP
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // ── Login page (GET) ─────────────────────────────────────────────────────
  app.get("/api/login", (req: any, res) => {
    if (req.session?.user) return res.redirect("/");
    const error = req.query.error
      ? `<div class="error">${req.query.error === "1" ? "Invalid email or password" : decodeURIComponent(req.query.error)}</div>`
      : "";
    res.send(authPage("Sign In", `
      ${error}
      <form method="POST" action="/api/login">
        <label>Email</label>
        <input type="email" name="email" placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" name="password" placeholder="••••••••" required />
        <button type="submit">Sign In</button>
      </form>
      <div class="switch">Don't have an account? <a href="/api/register">Register</a></div>
    `));
  });

  // ── Login (POST) ─────────────────────────────────────────────────────────
  app.post("/api/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email?.toLowerCase().trim() });
      if (!user || !(await user.comparePassword(password))) {
        return res.redirect("/api/login?error=1");
      }
      req.session.user = {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        profileImageUrl: user.profileImageUrl, role: user.role,
      };
      req.session.save(() => res.redirect("/"));
    } catch {
      res.redirect("/api/login?error=1");
    }
  });

  // ── Register page (GET) ──────────────────────────────────────────────────
  app.get("/api/register", (req: any, res) => {
    if (req.session?.user) return res.redirect("/");
    const error = req.query.error
      ? `<div class="error">${decodeURIComponent(req.query.error as string)}</div>`
      : "";
    res.send(authPage("Create Account", `
      ${error}
      <form method="POST" action="/api/register">
        <label>First Name</label>
        <input type="text" name="firstName" placeholder="Your first name" required />
        <label>Email</label>
        <input type="email" name="email" placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" name="password" placeholder="At least 6 characters" required minlength="6" />
        <button type="submit">Create Account</button>
      </form>
      <div class="switch">Already have an account? <a href="/api/login">Sign in</a></div>
    `));
  });

  // ── Register (POST) ──────────────────────────────────────────────────────
  app.post("/api/register", async (req: any, res) => {
    const { firstName, email, password } = req.body;
    try {
      if (!firstName || !email || !password)
        return res.redirect("/api/register?error=All+fields+are+required");
      if (password.length < 6)
        return res.redirect("/api/register?error=Password+must+be+at+least+6+characters");
      if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.redirect("/api/register?error=Email+already+registered");

      const user = new User({ firstName, email, password });
      await user.save();

      req.session.user = {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        profileImageUrl: user.profileImageUrl, role: user.role,
      };
      req.session.save(() => res.redirect("/"));
    } catch (e: any) {
      res.redirect(`/api/register?error=${encodeURIComponent("Registration failed. Try again.")}`);
    }
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  app.get("/api/logout", (req: any, res) => {
    req.session.destroy(() => res.redirect("/"));
  });
}

// ── isAuthenticated middleware ────────────────────────────────────────────────
export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

// ── isAdmin middleware ────────────────────────────────────────────────────────
export const isAdmin: RequestHandler = (req: any, res, next) => {
  if (req.session?.user?.role === "admin") return next();
  return res.status(403).json({ message: "Forbidden: Admins only" });
};

// ── Shared auth page HTML ────────────────────────────────────────────────────
function authPage(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title} – Lost &amp; Found</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#f8fafc;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
    .logo{display:flex;align-items:center;gap:10px;margin-bottom:28px;justify-content:center}
    .logo-box{width:36px;height:36px;background:#2563eb;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.1rem}
    .logo-text{font-size:1.15rem;font-weight:700;color:#0f172a}
    h2{font-size:1.5rem;font-weight:800;margin-bottom:4px;text-align:center;color:#0f172a}
    label{display:block;font-size:.82rem;font-weight:600;margin-bottom:5px;color:#0f172a;margin-top:14px}
    input{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;transition:border-color .15s;color:#0f172a}
    input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}
    button[type=submit]{width:100%;margin-top:22px;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .15s}
    button[type=submit]:hover{background:#1d4ed8}
    .switch{text-align:center;margin-top:18px;font-size:.85rem;color:#64748b}
    .switch a{color:#2563eb;font-weight:600;text-decoration:none}
    .switch a:hover{text-decoration:underline}
    .error{background:#fef2f2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:.84rem;margin-bottom:4px;border:1px solid #fecaca}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-box">L</div>
      <span class="logo-text">Lost &amp; Found</span>
    </div>
    <h2>${title}</h2>
    ${body}
  </div>
</body>
</html>`;
}
