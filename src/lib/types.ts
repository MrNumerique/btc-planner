export type Category = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  category_id: string;
  created_at: string;
};

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialFormState: FormState = { status: "idle", message: "" };
