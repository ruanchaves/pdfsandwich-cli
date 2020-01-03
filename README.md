# pdfsandwich-cli
A command line interface for a Dockerized instance of pdfsandwich hosted on AWS EC2.

# Installation ( Windows )

* Download this folder here or `git clone https://github.com/ruanchaves/pdfsandwich-cli.git` .

* [Install Node.js on Windows](https://www.guru99.com/download-install-node-js.html)

* On the pdfsandwich-cli folder, install dependencies:

```
npm install --save
```

# Usage


```
  node pdfsandwich-cli.js source.pdf target.pdf
```

`source.pdf` is the PDF file which you want to be annotated.
`target.pdf` is the filename for the result.

This command assumes `source.pdf` and `target.pdf` are on the same folder as pdfsandwich-cli. 
If they are elsewhere, you should inform the full path.

