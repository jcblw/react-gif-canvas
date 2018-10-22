# react gif canvas

This is a gif player that emulates a media player. This component fetch's a GIF, with fetch, and then parses the data of the gif and renders it to a canvas element.

The makes it so gifs can be played or paused.

## Why

We want long pages, with lots of gifs. Videos lack transparency. So supporting gifs is a must now to just make them easier to work with.

Right now this is proof of concept. It works and the testing suite is starting to fill, but there is a lot that is still needed.

## Things to come ( help wanted )

### Properties

- autoplay [default is true]
- defaultPlaybackRate
- duration [readonly]
- ended [readonly]
- error [readonly]
- loop [default is true]
- paused [read only]

### Events

- play
- pause
- ratechange
- loadedmetadata
- error
