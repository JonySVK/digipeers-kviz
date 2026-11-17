# digiPEERS Quiz

A simple quiz built with HTML, CSS, and JavaScript. You can customize the questions and appearance to suit your needs. It requires no installation or external libraries.

## Run the quiz

1. Download or copy all files into the same folder.
2. Open **index.html** in a browser.

To publish the quiz online, upload all files to the same folder on a static web host, such as GitHub Pages. The files reference one another by filename, so keep them together.

## Files

- **index.html** – the quiz home page and gameplay.
- **admin.html** – the administrator login and statistics.
- **questions.js** – the questions, answer options, and correct answers. Edit this file to change the quiz content.
- **script.js** – quiz logic, scoring, statistics, and the administrator access code.
- **style.css** – the colors, layout, and page styling.
- **logo.png** – the logo. Replace it with your own image using the same filename, or update its references in the HTML files.

## Customize the questions

Questions are stored in the **window.QUIZ_QUESTIONS** array in **questions.js**. Each question is an object with its text, 2 to 4 answer options, and the index of the correct answer:

    {
      question: "Which answer is correct?",
      options: ["First option", "Second option", "Third option"],
      correctIndex: 1
    }

The correctIndex value is zero-based: 0 refers to the first option, 1 to the second, and so on.

To add a question, copy an object, add it to the array, and separate questions with commas. The quiz automatically uses every question in the array and shows the selected and correct answers at the end.

## Customize the appearance

You can change the main colors near the top of **style.css**. The --purple variable sets the purple background, and --white sets the main text color. You can also adjust the sizes, spacing, and button styles in this file.

## Statistics

Open **admin.html** to access the administrator page. From the home page, you can also open it by double-clicking the large logo. Change the administrator access code in **script.js**, in the ADMIN_CODE declaration.

After each completed game, the browser stores the number of games played and the average percentage score. Statistics are saved in localStorage for that browser and device; they are not synced between browsers or devices. You can reset them from the administrator page.

The access code is included in the client-side JavaScript, so it only provides a basic barrier to the statistics page. Do not use it to protect sensitive information.
