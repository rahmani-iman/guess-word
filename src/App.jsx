import React, { useState, useEffect } from "react";

const Game = () => {
  const [currentWord, setCurrentWord] = useState("Pangolin");
  const [initialWord, setInitialWord] = useState("Pangolin");
  const [words, setWords] = useState([
    { word: "Pangolin", explanation: "default" },
  ]);

  // Save words to local storage when the component unmounts
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("words", JSON.stringify(words));
      localStorage.setItem("currentWord", JSON.stringify(currentWord)); // Save initial word
    };

    window.addEventListener("beforeunload", saveToLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", saveToLocalStorage);
    };
  }, [words, currentWord]);

  // Load words from local storage when the component mounts
  useEffect(() => {
    const storedWords = localStorage.getItem("words");
    const storedCurrentWord = localStorage.getItem("currentWord");

    if (storedWords && currentWord) {
      setWords(JSON.parse(storedWords));
      setCurrentWord(JSON.parse(storedCurrentWord)); // Set currentWord from initialWord
    }
  }, []);

  const handleAnswer = (answer) => {
    if (answer === "yes") {
      // System wins
      alert(`Yay! I guessed it. The word is ${initialWord}. 🎉`);
    } else {
      if (words.length !== 1) {
        // Ask user for explanations from last to first
        for (let i = words.length - 1; i >= 0; i--) {
          const userAnswer = prompt(
            `Is the word in your mind ${words[i].explanation}? (yes/no)`
          );

          if (userAnswer === "yes") {
            // System wins
            alert(`Yay! I guessed it. The word is ${currentWord}. 🎉`);
            break;
          } else if (i === 0) {
            // Reached the first word, create a new word
            const newWord = prompt("What word is in your mind?");
            const newExplanation = prompt(
              "Can you explain something about it?"
            );
            setWords((prevWords) => [
              ...prevWords,
              {
                word: newWord,
                explanation: newExplanation,
              },
            ]);
            setCurrentWord(newWord);
          }
        }
      } else {
        // User provides a new word and explanation
        const newWord = prompt("What word is in your mind?");
        const newExplanation = prompt("Can you explain something about it?");
        setWords((prevWords) => [
          ...prevWords,
          {
            word: newWord,
            explanation: newExplanation,
          },
        ]);
        setCurrentWord(newWord);
      }
    }
  };

  const resetGame = () => {
    setCurrentWord(initialWord);
    setWords([{ word: initialWord, explanation: "default" }]);
  };

  return (
    <div>
      <h1>Guess the Word!</h1>
      <p>Click on YES or ASK</p>
      {words.length === 1 && (
        <h4>Is the word in your mind {words[0].explanation}?</h4>
      )}
      {words.length === 1 && (
        <button onClick={() => handleAnswer("yes")}>YES</button>
      )}
      <button onClick={() => handleAnswer()}>ASK</button>
      <button onClick={() => resetGame()}>RESET</button>
    </div>
  );
};

export default Game;
