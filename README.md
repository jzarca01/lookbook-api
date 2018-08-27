# lookbook-api

An API for Lookbook.nu

## Usage

```javascript
const LookbookApi = require('lookbook-api');
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
lookbook.searchLooks(searchTerm, sort ?= 'top'|'new', time ?='year'|'month'|'day', gender ?= 'girls'|'guys', maxResults = "50")
```

### Search People

```javascript
lookbook.searchPeople(searchTerm, sort ?= 'top'|'new', time ?= 'year'|'month'|'day', gender ?= 'girls'|'guys', maxResults = "50")
```

### Hype a look 

```javascript
lookbook.hypeLook(lookId)
```

### Fan a user 

```javascript
lookbook.fanUser(userId)
```

### Unfan a user 

```javascript
lookbook.unfanUser(userId)
```

### Add a comment 

```javascript
lookbook.addComment(modelId, comment)
```

### Post a look

```javascript
lookbook.postLook(userId, { title, description, photo = 'test.jpeg', tumblr = 'NO', facebook = 'NO', twitter = 'NO' })
```
test.jpeg can be found in the folder 'Uploads'
