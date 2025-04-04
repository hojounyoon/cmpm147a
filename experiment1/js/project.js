// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

const fillers = {
  adventurer: ["Adventurer", "Traveller", "Fellow", "Citizen"],
  pre: ["Fra", "Tro", "Gre"],
  post: ["gria", "ston", "gott"],
  people: ["kindly", "meek", "brave", "wise"],
  item: ["axe", "staff", "book", "cloak"],
  num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of"],
  looty: ["gleaming", "valuable", "esteemed"],
  loots: ["coins", "chalices", "ingots"],
  baddies: ["orcs", "glubs", "fishmen"],
  message: ["call", "txt", "post", "decree"],
  
};

const template = `$adventurer, heed my $message!

I have just come from $pre$post where the $people folk are in desperate need. Their town has been overrun by $baddies. You must venture forth at once, taking my $item, and help them.

It is told that the one who can rescue them will be awarded with $num $looty $loots. Surely this must tempt one such as yourself!
`;


const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
