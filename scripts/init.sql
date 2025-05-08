--
-- Name: conversations; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.conversations (
    id SERIAL PRIMARY KEY,
    user_id integer,
    title text,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: messages; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    conversation_id integer,
    sender text NOT NULL,
    msg text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL
);