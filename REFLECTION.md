# SecureGate - Reflection & Engineering Analysis
**Name: Jessica Pinaowei**
**Cohort: Deign to MVP Bootcamp**
**Live URL: https://secure-gate-4n97.vercel.app**
**Github Repo: https://github.com/Pinaowei/secure-gate**

## Part 1 - What I built
I built a NextAuth authentication system that allows users to sign up, log in, and log out of their accounts. Users can also reset their passwords and verify their email addresses. 

##  Part 2 - What surprised me
Had to manually tell the agent to hash passwords. I also had to tell the agent to build a dashbord even when my prompt mentioned it should be built.

## part 3 - Engineeering Laws Quiz

### Q1 - Murphys's Law
 **code reference:** if (!emailResult.success) {
  if (!existing) {
    try {
      await db.user.delete({ where: { id: user.id } });
    } catch (delErr) {
      console.error("Failed to rollback user creation:", delErr);
    }
  }.** 
  'lib/actions.ts' lines 108-115
  
  **My answer:** Left unprotected, the login form is just an open door. Nothing stops someone from writing a script that tries thousands of password combinations against a real email address. Without rate limiting, SecureGate would sit there and process every single attempt.
  **Two things that can go wrong** First, if reset tokens never expire, a token sitting in someone's old email becomes a permanent backdoor into their account. Second, if I store the raw token in the database and the database is ever compromised, an attacker gets working reset links handed to them.


### Q2 - Law of Leaky Abstractions
 **code reference** import NextAuth from "next-auth";
 import Credentials from "next-auth/providers/credentials";
 import { z } from "zod"; 
 import { comparePassword } from "./password";
 import { db } from "./db"; 'lib/auths.ts' lines 3-7
 
 **My answer** Here is where NextAuth leaks, the credentials provider does not protect you from anything. When you use NextAuth with the Credentials provider (email + password, which is what SecureGate uses), NextAuth basically steps aside. The abstraction made you think you were getting a secure auth system.

### Q3 - YAGNI's law
**code reference:** return {
  id: user.id,
  email: user.email,
  emailVerified: user.emailVerified,
 }; 'lib/auths.ts' lines 47-51
 
 **My answer** SociaL login would violate YAGNI's Law because we don't have end users yet. MFA would violate YAGNI's Law because MFA is a layer you add on top of a working login system. I don't have a working login system yet. Audit logs would violate YAGNI's law because building an audit system today means designing a logging schema, deciding what events to capture, and maintaining that infrastructure — all for data nobody is reading.
 **How I would add them correctly later** When the time comes, I'll add a provider field to the User model, make the password nullable (since social users won't have one), and register the OAuth app credentials.

### Q4 - Kerckhoffs's Law
 **code reference**  pass: process.env.SMTP_PASSWORD 'emails.ts' line 11

 **My answer:** A salt is a random string added to a password before hashing it. So instead of hashing password123, bcrypt hashes password123 + xK92mPqR.... Every user gets a unique salt, so even if two users have the same password, their hashes look completely different.
 **Why bcrypt adds it automatically** So you can't forget to do it. bcrypt generates, attaches, and stores the salt inside the hash string itself.
 
 **What happens if I used SHA-256 instead** Rainbow tables — attackers pre-compute a giant list of SHA-256 hashes for common passwords. If your hash matches one on the list, the password is cracked instantly. Dictionary attacks — SHA-256 is extremely fast, so an attacker can hash millions of guesses per second until one matches. No salt — if two users have the same password, their SHA-256 hashes are identical, making bulk cracking trivial.

 


### Q5 - Postel's Law + Security by Design
 **Code reference:** export async function validateVerificationToken(rawToken: string) {
  const hashedToken = hashToken(rawToken); 'lib/tokens.ts' line 48-67

 **My answer** This is intentional and it's called user enumeration prevention. If your endpoint returned "Email not found" for unknown addresses and "Reset link sent" for known ones, an attacker could just submit a list of emails and use the different responses to find out which ones have accounts on your platform.
 **What happens if I change it?** It will leak the entire user base. Anyone can write a script, fire thousands of email addresses at your endpoint, and build a list of verified accounts.

### Q6 - The Boy Scout Rule
 **code reference:** const passwordHash = await hashPassword(password);

  await db.user.update({
    where: { id: record.userId },
    data: { passwordHash, passwordChangedAt: new Date() },
  }); 'lib/actions.ts' line 201-215

 **My answer** The Boy Scout Rule means: whenever you touch a file, leave it slightly cleaner than it was — even if the mess wasn't yours.
 
 **A real example found in the SecureGate scaffold** When setting up lib/db.ts, the Prisma singleton, I might notice the generated code has a variable named prisma declared twice — once at the top level and once inside the globalThis check. It still works, but it's confusing to read.
 
 **What I'd fiX** Rename the second one to prismaClient to make the distinction clear, and remove a leftover console.log("DB connected") that was probably added during testing and never removed.

### Q7. Gall's Law
 **Code reference** const SALT_ROUNDS = 12; 'lib/password.ts' line 5

 **My answer** Gall's Law says: a working complex system always grew from a working simple system. You can't design complexity from scratch and expect it to work.
 
 **How SecureGate matched this perfectly** Phase 1 was just a database and a schema — nothing could break except the connection. Phase 2 added hashing. Phase 3 added auth. Each phase was a working system before the next one was added.
 
 **If I had built all six phases at once** I'd have no idea if a bug came from the schema, the auth config, the token logic, the email service, or the middleware — they all touch each other. A broken database connection would look like a NextAuth error. A bad token would look like a Resend failure. Everything would point everywhere. Fixing one thing would break something two layers away, because nothing was stable ground to build on.

### Q8 Law of Leaky Abstractions
 **code reference:** const isLoggedIn = !!req.auth; 'middleware.ts' line 11

 **My answer** The @default(cuid()) situation. In my Prisma schema, the User model has: prismaid String @id @default(cuid()) Prisma generates the cuid value in application code before sending it to the database. The actual PostgreSQL column has no default — it just receives whatever Prisma passes in. 
 
 **Why this matters — the leaky abstraction part** Prisma gives me the illusion that my schema is my database. It isn't. Prisma is a layer sitting on top of it. The moment I go around that layer — a raw SQL query, a migration tool, a DB admin insert — the rules Prisma silently enforced disappear, and the database has no fallback.

### Q9 - Zawinski's Law
 **Code reference:** if (!emailResult.success) {
  if (!existing) {
    try {
      await db.user.delete({ where: { id: user.id } });
    } catch (delErr) {
      console.error("Failed to rollback user creation:", delErr);
    }
  }  'lib/actions.ts' line 108-115

 **My answer** Principle demonstrated: Single Responsibility Rate limiting isn't NextAuth's job. NextAuth handles authentication. Rate limiting handles traffic abuse. 
 
 **Zawinski's Law warns** that every program attempts to expand until it can be simplified, and that "all simple and elegant programs become less elegant as they are required to accommodate more features." The fact that I had to add rate limiting myself is the system working correctly.

### Q10 - The Principle of Least Surprise
 **Code reference** loginUrl.searchParams.set("callbackUrl", nextUrl.pathname); 'middleware.ts' line 16

 **My Answer:** The message to show: "Invalid email or password."
 
 **Why that wording?** Because it doesn't tell an attacker whether the email exists in your system or not. If you say "email not found" vs "wrong password" separately, you've just helped someone enumerate real accounts. One vague message covers both cases.

 **What the Principle of Least Surprise says about error messages** They should behave the way users already expect from other apps they've used. Most people have seen "invalid email or password" on every major platform — Gmail, Twitter, banks — so it feels familiar, not confusing.

### Q11 - Murphy's Law + Defensive Programming
 **Code reference** try {
  await db.user.delete({ where: { id: user.id } });
 } catch (delErr) {
  console.error("Failed to rollback user creation:", delErr);
 } 'lib/actions.ts' line 110-115

 **My answer** The middleware reads the session cookie that NextAuth sets when a user logs in. It calls auth() (or getToken()) which decodes and validates that cookie.
 **If the cookie is deleted** Middleware runs on every request to /dashboard,auth() finds no cookie, returns null,Middleware sees no session, calls NextResponse.redirect() to /login, User never touches the dashboard — they hit the redirect before the page loads.

 **The exact path** Request to /dashboard, middleware.ts runs first, checks session via auth(), session is null (cookie gone), redirect to /login, dashboard page never executes.

### Q12 - Kerckhoffs's Principle + Technical Debt
 **Code reference** const passwordValid = await comparePassword(password, user.passwordHash); 'lib/auth.ts' lines 38-41

 **My answer** What Happens If NEXTAUTH_SECRET Gets Leaked on GitHub What an attacker can do with it: NextAuth uses the secret to sign and verify session tokens. If someone has it, they can forge a valid session token for any user, including admins, without knowing any password. They are now inside your app.

 **Step by step what happens after the commit** GitHub indexes the file. It is now searchable and may be picked up by automated bots that scan for secrets within minutes, not days. Even if you delete the file in a new commit, the secret is still visible in your git history. Deletion does not equal removal.

 **How I would recover** Rotate the secret immediately — generate a new one (openssl rand -base64 32) and replace it in your environment variables on your hosting platform. Invalidate all existing sessions — changing the secret automatically kills every active session since old tokens can no longer be verified. Users will be logged out, which is the intended side effect.

### Q13 - Conway's Law
 **My answer** Conway's Law says: the way you organise your team (or your mind) shows up directly in the code you write. In SecureGate's case: A full-stack developer thinks in responsibilities — auth, database, email, UI.
 **How my folders shows how I think** Each folder is basically a department in my head. I separated concerns because my brain processes them separately.

### Q14 - Technical Debt 
 **Code reference** const userId = await validateVerificationToken(token);

if (!userId) {
  return {
    success: false,
    error: "This verification link is invalid or has expired.",
  };
}

return { success: true, data: undefined }; // ← user is never marked as verified 'lib/actions.ts' lines 239-246

 **My answer** The debt is hardcoded token expiry times. In lib/tokens.ts the expiry durations are written as raw math directly in the code. 

 **Why it's debt** That magic number 24 * 60 * 60 * 1000 means nothing to someone reading the code cold. Worse, if you need to change the expiry window, you have to hunt down every place it appears — and hope you don't miss one.

 **Why I left it** It works. When you're scaffolding fast, you write the thing that gets it running and move on.

  **Refactored version** Create a central config file:
  // lib/config.ts
  export const TOKEN_EXPIRY = {
   emailVerification: 24 * 60 * 60 * 1000, // 24 hours
   passwordReset: 1 * 60 * 60 * 1000,      // 1 hour
  } as const
  Then use it everywhere.

### Q15 - Synthesis question
 **code reference**

 **My answer** When money is involved, everything I already built in SecureGate still applies — it just has higher stakes. Auth & verification — a user must be authenticated AND email-verified before they can pay. Same redirect logic, stricter enforcement.Password hashing & session security — a compromised account now means a compromised payment method. Rate limiting — now protects the payment endpoint too, not just login. Error handling — same pattern: never expose internals to the client, return clean user-facing messages. Environment variables — my Flutterwave secret key lives in .env just like my Resend key.
 
 **What becomes more critical when money is involved** Idempotency, webhook verification, audit logging, user trust signals and database transaction becomes important.

## Part 4 - One thing i would refactor
The Debt: Hardcoded token expiry times. I would refactor it by creating a central config file for token expiry times and use it everywhere in the code. 
// lib/config.ts
export const TOKEN_EXPIRY = {
  emailVerification: 24 * 60 * 60 * 1000, // 24 hours
  passwordReset: 1 * 60 * 60 * 1000,      // 1 hour
} as const

## Part 5 - How this changes how I build
Going forward, I would priortize password hashing using bycrpt, I would always examine the codebase for bloats and security vulnerabilities and refactor them. I would also pay close attention to best practices such as conditionally rendering of the authentications pages, adding error validation when necessary.
