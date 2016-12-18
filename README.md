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

## Special quotes

Add a sticker:

´´´ /add sti!:<stickerID>(<tags or other text that will be ignored but can be searched>) ´´´

Bold/markdown:
You need to double markdown commands, because telegram will parse them in your message.

``` /add **bold quote** ```