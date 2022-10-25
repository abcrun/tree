A Javascript Library to Create A Tree Structures With CSS style. 

### Install

`npm i @dabobo/tree` or `yarn add @dabobo/tree`

### How to Use It

```javascript
import Tree from '@dabobo/tree';

// default data
const data = {
  name: '0',
  children: [
    { name: '10' },
    {
      name: '11',
      children: [
        { name: '210' },
        { 
          name: '211',
          children: [
            { name: '2110' },
            { name: '2111' }
          ]
        },
        { name: '212' }
      ]
    },
    { name: '12' },
    { name: '13' },
    { name: '14' }
  ]
};

const options = {
  width: 300, // node width -> number or function
  height: (item) => { // node height -> number or function
    const { level } = item;

    switch (level) {
      case 0:
        return 100;
      case 1:
        return 200;
      case 3:
        return 300;
      default:
        return 200;
    }
  },
  offset: { // level gap space width
    x: 40,
    y: 80
  },
  direction: 'hv' // hv or vh -> form top to bottom or from left to right
};

const tree = Tree.create(data, options);
```
