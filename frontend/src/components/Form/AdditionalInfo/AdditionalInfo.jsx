import {formStyles as styles, handleChange} from '../imports'

const AdditionalInfo = ({additionalInfo, setAdditionalInfo}) => {
    return(
        <div className={styles.additionalInfo}>
        <h3>Additional Information</h3>
        <textarea
          placeholder="Personal Bio or Summary (in 200 Words Only)"
          name='personalBio'
          value={additionalInfo.personalBio}
          onChange={(e) => handleChange(e, setAdditionalInfo)}
          className={styles.textArea}
        ></textarea>
      </div>
    )
}

export default AdditionalInfo