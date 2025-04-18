# 📦 doty

A containerised minimal starter kit for [Eleventy](https://www.11ty.dev) with components.

## Install Dependencies

Eleventy is served over HTTPS and you will need to create a valid certificate for this.

### Install mkcert on your system

The installation instructions for macOS, Windows and Linux can be found in the [mkcert Github repository](https://github.com/FiloSottile/mkcert).

### Create a valid certificate

Create a folder for the certificate in your project folder and cd into it

```
mkdir _mkcert && cd _mkcert
```

Create the certificate and cd back to root:

```
mkcert localhost && cd ..
```

### Install just

For convenience, the project uses [just](https://just.systems/) to run Docker commands.

Follow the [installation instructions](https://just.systems/man/en/introduction.html) to get it up and running on your system.

### Install Docker

Finally, you'll need [Docker](https://www.docker.com/), and if you don't already have it running on your system, [the Docker manuals should get you started](https://docs.docker.com/get-started/).

## That's it!

**Start the project:**

```
just start
```

Open https://localhost:8080 in your browser.

**Stop the project:**

```
just stop
```

**Build the project:**

```
just build
```

You will find the build output in the `_dist` folder.