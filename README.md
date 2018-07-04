# lookbook-api

An API for Lookbook.nu

## Usage

```javascript
const LookbookApi = require('./index');
const lookbook = new LookbookApi();
```

### Sign up

```javascript
lookbook.signUp(login, password, name, gender ?= 'girl'|'guy')
```

### Log in

```javascript
lookbook.login(login, password);
```

### Get User Info

```javascript
lookbook.getUser(userId);
```

### Get Looks

```javascript
lookbook.getNewLooks(gender ?= 'girls'|'guys')
lookbook.getHotLooks(gender ?= 'girls'|'guys')
lookbook.getTopLooks(gender ?= 'girls'|'guys')
```

### Get Looks By Category

```javascript
lookbook.getLooksByCategory(category);
```

### Get Look Info

```javascript
lookbook.getLook(lookId);
```

### Get Items infos for a specific look

```javascript
lookbook.getItemsByLook(lookId);
```

### Search Looks

```javascript
lookbook.sarchLooks(searchTerm, sort ?= 'top'|'new', time ?='year'|'month'|'day', gender ?= 'girls'|'guys')
```

### Search People

```javascript
lookbook.sarchPeople(searchTerm, sort ?= 'top'|'new', time ?= 'year'|'month'|'day', gender ?= 'girls'|'guys')
```
