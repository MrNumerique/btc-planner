export type Category = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Commune = {
  id: string;
  name: string;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  category_ids: string[];
  commune_id: string | null;
  created_at: string;
};

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialFormState: FormState = { status: "idle", message: "" };
