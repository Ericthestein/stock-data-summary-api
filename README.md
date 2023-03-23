# Stock Data Summary API

This API provides a GET endpoint that returns a summary for a given stock:

```
GET /stocks/:ticker
```

## Live

This API is currently live at [this endpoint](https://stock-data-summary.alcka3a5fmha4.us-east-1.cs.amazonlightsail.com/stocks/meta)

## Running with Docker

### Build

```
docker build . -t ericthestein/novig-backend-exercise
```

### Run

```
docker run -p 80:80 -e FMP_KEY="" -d ericthestein/novig-backend-exercise
```
