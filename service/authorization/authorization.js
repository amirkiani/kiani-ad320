import { User } from '../models/User.js'
import assert from 'assert'

export function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }
}

export function sanitizeUsers(users) {
  return users.map((user) => sanitizeUser(user))
}

function atOrAboveRole(myRole, roleToCheckAgainst) {
    if (myRole === roleToCheckAgainst) {
        return true
    } else if (roleToCheckAgainst === 'user') {
        return myRole === 'superuser' || myRole === 'admin'
    } else if (roleToCheckAgainst === 'superuser') {
        return myRole === 'admin' 
    } else {
        return false
    }
}

assert(atOrAboveRole('user', 'user'))
assert(atOrAboveRole('superuser', 'superuser'))
assert(atOrAboveRole('admin', 'admin'))
assert(atOrAboveRole('superuser', 'user'))
assert(atOrAboveRole('admin', 'user'))
assert(atOrAboveRole('admin', 'superuser'))

assert(!atOrAboveRole(null, 'user'))
assert(!atOrAboveRole(null, 'superuser'))
assert(!atOrAboveRole(null, 'admin'))
assert(!atOrAboveRole('user', 'superuser'))
assert(!atOrAboveRole('user', 'admin'))
assert(!atOrAboveRole('superuser', 'admin'))



export async function isAdmin(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'admin')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for admin: ${err}`)
        res.sendStatus(502) 
    }   
}

export async function isSuperuser(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'superuser')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for superuser: ${err}`)
        res.sendStatus(500) 
    }
}

export async function isUser(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'user')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for user: ${err}`)
        res.sendStatus(500) 
    }
}

export async function userTryingToUpdateItself(req, res, next) {
    
}