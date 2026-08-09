import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>CampCheck</p>
      </div>

      <div className="privacy-card">
        <p className="privacy-updated">
          Last updated: 9 August 2026
        </p>

        <section>
          <h2>1. Who we are</h2>
          <p>
            CampCheck is operated by Liam Owen.
          </p>
          <p>
            If you have any questions about this Privacy Policy or
            how your information is handled, contact us at:
          </p>
          <p>
            <strong>Renewed.service@gmail.com</strong>
          </p>
        </section>

        <section>
          <h2>2. Information we collect</h2>
          <p>
            Depending on how you use CampCheck, we may store:
          </p>

          <ul>
            <li>Your name or display name</li>
            <li>Your CampCheck account information</li>
            <li>Camping group membership information</li>
            <li>Trips and trip details you enter</li>
            <li>Shopping-list items</li>
            <li>Checklist information</li>
            <li>Caravan, motorhome or vehicle information you enter</li>
            <li>App settings and preferences</li>
            <li>Ratings and feedback you submit</li>
          </ul>

          <p>
            We only collect information needed to provide and
            improve CampCheck.
          </p>
        </section>

        <section>
          <h2>3. How we use your information</h2>

          <p>Your information may be used to:</p>

          <ul>
            <li>Provide CampCheck's features</li>
            <li>Synchronise your information between devices</li>
            <li>Allow camping group members to use shared information</li>
            <li>Save your trips, checklists and shopping lists</li>
            <li>Store vehicle and caravan information</li>
            <li>Maintain and improve CampCheck</li>
            <li>Respond to support requests</li>
            <li>Review feedback and ratings</li>
          </ul>
        </section>

        <section>
          <h2>4. Where your information is stored</h2>

          <p>
            CampCheck uses Firebase services provided by Google to
            store and synchronise information.
          </p>

          <p>
            Information submitted to CampCheck may therefore be
            processed and stored using Google's Firebase
            infrastructure.
          </p>
        </section>

        <section>
          <h2>5. Sharing your information</h2>

          <p>
            We do not sell your personal information.
          </p>

          <p>
            Information within a camping group may be visible to
            other members of that group where this is necessary for
            CampCheck's group features.
          </p>

          <p>
            We may use service providers such as Firebase to provide
            the technical infrastructure required to operate
            CampCheck.
          </p>
        </section>

        <section>
          <h2>6. How long we keep your information</h2>

          <p>
            We keep your information for as long as your CampCheck
            account and associated data are required to provide the
            service.
          </p>

          <p>
            When you delete your account, we will delete your
            CampCheck account and associated data, subject to any
            information we may be legally required to retain.
          </p>
        </section>

        <section>
          <h2>7. Your rights</h2>

          <p>
            Depending on the circumstances, you may have rights
            including:
          </p>

          <ul>
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict certain processing</li>
            <li>The right to object to certain processing</li>
            <li>The right to data portability where applicable</li>
          </ul>
        </section>

        <section>
          <h2>8. Deleting your CampCheck account</h2>

          <p>
            CampCheck is intended to allow users to delete their
            account and associated CampCheck data from within the
            app.
          </p>

          <p>
            Account deletion will remove the account and associated
            personal data from our systems, subject to information
            that we may be required to retain by law.
          </p>
        </section>

        <section>
          <h2>9. Security</h2>

          <p>
            We use reasonable technical and organisational measures
            to protect information stored by CampCheck. However, no
            internet-based service can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>10. Children's privacy</h2>

          <p>
            CampCheck is not specifically directed at children. We
            do not knowingly collect personal information from
            children without appropriate involvement of a parent or
            guardian.
          </p>
        </section>

        <section>
          <h2>11. Changes to this Privacy Policy</h2>

          <p>
            We may update this Privacy Policy when CampCheck's
            features or the way we handle information changes. The
            latest version will always be made available within
            CampCheck.
          </p>
        </section>

        <section>
          <h2>12. Contact us</h2>

          <p>
            For privacy questions, requests or concerns:
          </p>

          <p>
            <strong>Liam Owen</strong>
            <br />
            <strong>Renewed.service@gmail.com</strong>
          </p>
        </section>

        <section>
          <h2>13. Complaints</h2>

          <p>
            If you are unhappy with how we handle your personal
            information, please contact us first so we have an
            opportunity to resolve your concern.
          </p>

          <p>
            You can also contact the UK's Information Commissioner's
            Office (ICO) about data-protection concerns.
          </p>
        </section>

        <button
          className="privacy-back-btn"
          onClick={() => navigate("/settings")}
        >
          Back to Settings
        </button>
      </div>
    </div>
  );
}