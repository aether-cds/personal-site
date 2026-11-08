import Modal from "@/components/ui/Modal";

type HelpDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="modal-body">
        <section>
          <h3>The playground</h3>
          <p>
            The dot field and black shapes are physical. Drag a shape with your
            mouse or finger and it will keep a little momentum when you let go.
            Dots move out of the cursor&apos;s way and spring back home.
          </p>
        </section>

        <section>
          <h3>Resize &amp; nudge</h3>
          <p>
            Select a shape, then scroll over the play area or pinch with two
            fingers to resize it. Use the arrow keys to nudge it in small
            steps, or hold <kbd>Shift</kbd> for bigger steps. Press{" "}
            <kbd>Esc</kbd> or the shuffle button to rebuild the field.
          </p>
        </section>

        <section>
          <h3>Time, language &amp; Bikram Sambat</h3>
          <p>
            The clock opens on Nepal Standard Time (UTC+5:45) wherever you are.
            Switch to <strong>Local</strong> to use your own timezone. The month
            and day are always Bikram Sambat, converted from the Gregorian date
            with a real calendar library. <strong>EN / ने</strong> changes the
            labels, month name and numerals.
          </p>
        </section>

        <section>
          <h3>Sound</h3>
          <p>
            Sound is off by default. Turn it on with the speaker button to hear
            synthesised singing-bowl tones: pitch follows an object&apos;s size
            and position, and a low gong sounds on the hour. Everything is
            generated with the Web Audio API — no audio files.
          </p>
        </section>

        <section>
          <h3>One more thing</h3>
          <p>
            Type <strong>namaste</strong> anywhere on the page. The shapes will
            bow. Press <kbd>Esc</kbd> to close this panel.
          </p>
        </section>

        <p className="modal-note">
          Motion and sound follow <code>prefers-reduced-motion</code>. If your
          system asks for less motion, physics and sound are disabled
          automatically.
        </p>
      </div>
    </Modal>
  );
}
