---
title: "TypeScript Generics: From Basics to Conditional Types"
date: "2025-04-12"
description: "A deep dive into TypeScript generics — generic functions, constrained type parameters, mapped types, conditional types, and infer. With practical examples you'll actually use."
categories: ["TypeScript"]
tags: ["typescript", "advanced", "types", "programming"]
draft: false
---

# TypeScript Generics: From Basics to Conditional Types

Generics are TypeScript's mechanism for writing code that works over a variety of types while maintaining type safety. If you've only used `Array<T>` or `Promise<T>`, you're using generics without knowing it.

## The Core Concept

Without generics, you'd need separate functions for each type:

```typescript
function firstString(arr: string[]): string | undefined {
  return arr[0]
}

function firstNumber(arr: number[]): number | undefined {
  return arr[0]
}
```

With generics, one function handles all types:

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const s = first(['a', 'b', 'c'])  // type: string | undefined
const n = first([1, 2, 3])        // type: number | undefined
```

## Constrained Type Parameters

Use `extends` to restrict what types a generic can accept:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
const name = getProperty(user, 'name')  // type: string
const age = getProperty(user, 'age')    // type: number
// getProperty(user, 'email')           // ❌ Error: not a key of typeof user
```

## Generic Interfaces and Classes

```typescript
interface Repository<T, ID = number> {
  findById(id: ID): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: ID): Promise<void>
}

class PostRepository implements Repository<Post> {
  async findById(id: number): Promise<Post | null> {
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | null
  }
  
  async findAll(): Promise<Post[]> {
    return db.prepare('SELECT * FROM posts').all() as Post[]
  }
  
  async save(post: Post): Promise<Post> {
    // upsert logic
    return post
  }
  
  async delete(id: number): Promise<void> {
    db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  }
}
```

## Mapped Types

Mapped types transform every property of an existing type:

```typescript
// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Extract only certain keys
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Practical example: form state
interface Post {
  title: string
  description: string
  content: string
  draft: boolean
}

type PostFormState = {
  [K in keyof Post]: {
    value: Post[K]
    error: string | null
    touched: boolean
  }
}
```

## Conditional Types

Conditional types select a type based on a condition:

```typescript
// T extends U ? X : Y
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

A more practical example — unwrapping Promise types:

```typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

type R1 = Awaited<Promise<string>>           // string
type R2 = Awaited<Promise<Promise<number>>>  // number
type R3 = Awaited<string>                    // string (not a promise)
```

## The `infer` Keyword

`infer` lets you capture a type within a conditional type:

```typescript
// Extract the return type of a function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function fetchUser(id: number): Promise<User> { /* ... */ }

type FetchReturn = ReturnType<typeof fetchUser>  // Promise<User>

// Extract element type from array
type ElementType<T> = T extends (infer E)[] ? E : never

type E = ElementType<string[]>  // string
```

## Template Literal Types

Combine string literals with generics:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>  // 'onClick'
type FocusEvent = EventName<'focus'>  // 'onFocus'

// Build typed event handlers
type Handlers<T extends string> = {
  [K in T as EventName<K>]: (event: Event) => void
}

type ButtonHandlers = Handlers<'click' | 'focus' | 'blur'>
// {
//   onClick: (event: Event) => void
//   onFocus: (event: Event) => void
//   onBlur: (event: Event) => void
// }
```

## A Real-World Pattern: Type-Safe API Client

```typescript
type ApiEndpoints = {
  '/posts': { GET: PostMeta[]; POST: { title: string; content: string } }
  '/posts/:slug': { GET: Post; DELETE: void }
  '/search': { GET: SearchResult[] }
}

async function apiFetch<
  Path extends keyof ApiEndpoints,
  Method extends keyof ApiEndpoints[Path]
>(
  path: Path,
  method: Method,
  body?: ApiEndpoints[Path][Method] extends { POST: infer B } ? B : never
): Promise<ApiEndpoints[Path][Method]> {
  const res = await fetch(path, {
    method: method as string,
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

const posts = await apiFetch('/posts', 'GET')      // type: PostMeta[]
const post = await apiFetch('/posts/:slug', 'GET') // type: Post
```

## When to Use Generics

Use generics when:
1. A function or class works the same way regardless of the type it operates on
2. You need to express relationships between input and output types
3. You're building reusable library code

Don't use generics when:
1. You only have one concrete type (just use that type)
2. The relationship is complex enough that `any` is clearer (rare, but real)
3. You're adding `<T>` "just in case" — YAGNI applies to types too
