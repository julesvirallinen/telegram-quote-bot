# Telegram quotebot

Telegram bot that remembers quotes, and can serve them by word or randomly.

Works with multiple groups, and serves quotes for own group.

## Use

The bot is running as @puppy2_bot. Add it to a group and send /start to initialize it.

## Commands

/addquote - adds a quote
/quote {searchterm} - returns the first quote with the given term
/quote {id} - returns the quote with the matching id
/quote - returns a random quote

## Special things

Replying to any message with /add adds it as a quote. 
This also works with stickers, use ```/add <tags to search for sticker>```

Adding :user: to quote replaces it with the first name of whoever is asking for the quote. 

Bold/markdown:
You need to double markdown commands, because telegram will parse them in your message.

``` /add **bold quote** ```