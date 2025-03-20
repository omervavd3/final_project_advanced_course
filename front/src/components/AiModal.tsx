import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "./Loader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = z.object({
  prompt: z.string().nonempty("Prompt is required"),
});

type FormData = z.infer<typeof schema>;

const AiModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubit = async (data: FormData) => {
    setLoading(true);
    reset();
    setPrompt(initialPrompt);
    console.log(data.prompt);
    await axios
      .post(
        "http://localhost:3000/ai",
        { prompt: data.prompt },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setAiMessages(
          response.data.response.candidates[0].content.parts[0].text
        );
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error connecting to AI server");
        console.error(error);
      });
    setLoading(false);
  };

  const initialPrompt =
    "I would like to receive an Instagram comment idea for a post about: ";
  const [prompt, setPrompt] = useState(initialPrompt);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chat with Gemini
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="chat-box mb-3">
                  {aiMessages && <p>{aiMessages}</p>}
                </div>
                <form onSubmit={handleSubmit(onSubit)}>
                  <textarea
                    id="prompt"
                    {...register("prompt")}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className={`form-control ${
                      errors.prompt ? "is-invalid" : ""
                    }`}
                  />
                  {errors.prompt && (
                    <div className="invalid-feedback">
                      {errors.prompt.message}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-100">
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiModal;
