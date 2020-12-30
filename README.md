### How it works

#### Collecting CSS owner files

Css owner files are those files that can include `<link>` tags where the `rel` attribute = `stylesheet`. 

A given directory is iterated collecting the list of CSS owner files with given extensions. Default extensions are:

* .html
* .cshtml
* .aspx
* .vue'

Default extensions can be changed with the `css-owner-extensions` argument.

### Collecting CSS information

The `getCssInfo` function is where CSS info is extracted from each CSS owner file. The CSS owner file list is iterated and the contents of each CSS owner file is read. 

For each owner file a `fileInfo` object is created 

    {
        filename: CSS owner file name,
        cssInfo: An array of CSS info for each CSS file referenced.
    }

This object provides the CSS owner file name and all CSS info and will ultimately drive the process to update CSS references with a cache-busting query string.

`getCssInfo` returns an array of fileInfo objects. The rest of this section explains the `fileInfo` in more detail. 

For each owner file, the `jsdom` NPM package creates a DOM object and from that object all `link` tags are selected:

    let fileContents = fileio.readFile(filename);
    const dom = new JSDOM(fileContents);

    const ls = dom.window.document.querySelectorAll('link');

If the value of the `rel` attribute of a selected `link` is `spreadsheet` the link tag is parsed to create this `cssInfoObject` object:

    {
        href: the full `href` attribute value
        cssFile: href's file name
        queryString: href's query string
        newQueryString: href's new query string
    }

The `newQueryString` will replace the existing `queryString`. A cache-busting query value pair is generated where the key is `v` and the value is a unique 21-character value (generated with the NPM `nanoid` package). If the query string previously had `v` value that value is replaced, otherwise the `v` value is added to the existing query string. 

The following test made to use this new CSS information:

    If `cssFile` ends with `.css.`
        If `includeExternalCss` argument is provided OR  
        If `includeExternalCss` argument is not provided AND 
            the `href` value does not start with `http`  

If the test above is true, the `cssInfoObject` is added to the `fileInfo's` `cssInfo` array. 

The image below shows a `fileInfo` object with a three-element `cssInfo` array. In this example, this CSS owner file had three CSS files. 

![](https://rogerpence.com/storage/images/css-cache-busting-objects.2459214.54306.png)

These are the corresponding objects for each of the three CSS files. 

### Performing the update

The `getCssInfo` function discussed in the previous section purposely does not perform updates to CSS owner files. While it could, and it may even be convenient to perform the file updates `getCssInfo` (after all, the CSS owner file has been read and its contents are readily available in `getCssInfo`), all but defeats any rational testing. 

The trade-off made here is to lean into testing and let performance suffer a little. Enabling effective testing means reading each CSS owner file twice: Once to fetch `fileInfo` objects for each CSS owner file and then once to perform the file update. Given how quickly Node reads each owner file, and given that the process of cache-busting is usually performed in an automated, pre-deployment step, I don't much care if this cache buster takes a few extra seconds to run. 

The update is performed with this logic

    for each CSS owner file 
        read file contents
        for each `fileInfo` object's `cssInfo` array element:
            search and replace the file contents' old `href` with a new one using the information in the `cssInfo` element

This search and replace is a little kludgy. I would much rather use an NPM HTML parsing package (the NPM `jsdom` very effective fetches CSS href info). However, virtually every NPM parsing package I tested (including `jssoup`, `node-html-parser`, `cheerio`, and `jsdom`) escaped query strings in the `href` tag. 

For example, this code using `jsdom` 

    let fileContents = fileio.readFile(filename);
    const ls = dom.window.document.querySelectorAll('link');

    let href = 'main.css?v=12335&foo=bar
    ls[0].setAttribute('href', href);

results in the `href` value being:

    main.css?v=12335&amp;foo=bar

I wasted way too much time trying to figure out how to disable this automatic escaping feature.     
