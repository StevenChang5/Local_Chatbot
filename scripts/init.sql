--
-- Name: conversations; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    user_id integer,
    title text,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: messages; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    conversation_id integer,
    sender text NOT NULL,
    msg text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: stevenchang
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL
);