// src/components/AnimatedSignature/AnimatedSignature.jsx
import React from 'react';
import styles from './AnimatedSignature.module.scss';
import { ReactComponent as NigelSVG } from '../../Nigel & Victoria.svg'// Use the actual path

const AnimatedSignature = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.title}>
        <NigelSVG className={styles.animatedSvg} />
      </div>
    </div>
  );
};

export default AnimatedSignature;
