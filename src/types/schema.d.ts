import { bookmarksTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Bookmark = InferSelectModel<typeof bookmarksTable>;
