import React, { useState } from "react";
import styles from "./TipAndInstructions.module.css";

const TipAndInstructions = ({ onTipChange, onInstructionChange }) => {
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [instruction, setInstruction] = useState("");

  const tipOptions = [10, 20, 50];

  const handleTipSelect = (amount) => {
  if (selectedTip === amount) {
    // If clicking on the already selected tip → unselect it
    setSelectedTip(0);
    setCustomTip("");
    onTipChange(0);
  } else {
    // Normal selection
    setSelectedTip(amount);
    setCustomTip("");
    onTipChange(amount);
  }
};


  const handleCustomTip = (value) => {
    const amount = parseInt(value) || 0;
    setCustomTip(value);
    setSelectedTip(0);
    onTipChange(amount);
  };

  const handleInstruction = (value) => {
    setInstruction(value);
    onInstructionChange(value);
  };

  return (
    <div className={styles.tipInstructionContainer}>
      {/* Tip Section */}
      <div className={styles.tipBox}>
        <h3>Give a Tip 💚</h3>
        <p className={styles.subText}>Your tip goes directly to the delivery partner</p>
        <div className={styles.tipOptions}>
          {tipOptions.map((amt) => (
            <button
              key={amt}
              onClick={() => handleTipSelect(amt)}
              className={`${styles.tipBtn} ${
                selectedTip === amt ? styles.selected : ""
              }`}
            >
              ₹{amt}
            </button>
          ))}
          <input
            type="number"
            placeholder="Custom"
            value={customTip}
            onChange={(e) => handleCustomTip(e.target.value)}
            className={styles.customInput}
          />
        </div>
      </div>

      {/* Delivery Instructions Section */}
      <div className={styles.instructionBox}>
        <h3>Delivery Instructions 📝</h3>
        <textarea
          placeholder="Add instructions for your delivery (e.g., Ring the bell once, leave at door)"
          value={instruction}
          onChange={(e) => handleInstruction(e.target.value)}
          className={styles.textarea}
          rows={3}
        />
      </div>
    </div>
  );
};

export default TipAndInstructions;
