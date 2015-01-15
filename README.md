grunt-update-contributors
=========================

Update and commit contributors in JSON files - all developers who commited to the repository, sorted by number of commits.

Based on Vojta Jinas [grunt-npm](https://github.com/vojtajina/grunt-npm).


## Installation

Install npm package, next to your project's `Gruntfile.js` file:

    npm install grunt-update-contributors --save-dev

Add this line to your project's `Gruntfile.js`:

    grunt.loadNpmTasks('grunt-update-contributors');


## Use

`$ grunt update-contributors` or use the 'update-contributors' tasks in other tasks.

#### Default Configuration
```js
'update-contributors': {
  options: {
    file: 'package.json',
    commit: true,
    commitMessage: 'Update contributors',
    as: 'contributors',
    filter: function(contributors) {
      // assuming the top commiter is the author, ignore him as a contributor
      return contributors.slice(1);
    }
  }
}
```

#### Multitask
This is a multitask, so we can update multiple files

```js
'update-contributors': {
  bower: {
    options: {
      file: 'bower.json',
      commitMessage: 'Update bower authors',
      as: 'authors',
      filter: false
    }
  }
}
```


## .mailmap

A `.mailmap` file can be used to map multiple emails to a single person.  
See [git-shortlog#_mapping_authors](http://git-scm.com/docs/git-shortlog#_mapping_authors)
