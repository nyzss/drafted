import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    boolean,
    AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./auth-schema";

export * from "./auth-schema";

export const foldersTable = pgTable("folders", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    parentId: uuid("parent_id").references((): AnyPgColumn => foldersTable.id),
    userId: text()
        .references(() => usersTable.id)
        .notNull(),
    icon: varchar({ length: 255 }),
    isPrivate: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export const bookmarksTable = pgTable("bookmarks", {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    url: varchar({ length: 2048 }).notNull(),
    image: varchar({ length: 2048 }),
    favicon: varchar({ length: 2048 }),
    ogType: varchar({ length: 255 }),
    ogTitle: varchar({ length: 255 }),
    ogImage: varchar({ length: 2048 }),
    ogDescription: text(),
    charset: varchar({ length: 32 }),
    folderId: uuid().references(() => foldersTable.id),
    userId: text()
        .references(() => usersTable.id)
        .notNull(),
    isPrivate: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export const tagsTable = pgTable("tags", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    userId: text()
        .references(() => usersTable.id)
        .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
});

export const bookmarkToTagsTable = pgTable("bookmark_tags", {
    bookmarkId: uuid()
        .references(() => bookmarksTable.id)
        .notNull(),
    tagId: uuid()
        .references(() => tagsTable.id)
        .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
    folders: many(foldersTable),
    bookmarks: many(bookmarksTable),
    tags: many(tagsTable),
}));

export const foldersRelations = relations(foldersTable, ({ one, many }) => ({
    parent: one(foldersTable, {
        fields: [foldersTable.parentId],
        references: [foldersTable.id],
        relationName: "parentChildren",
    }),
    children: many(foldersTable, {
        relationName: "parentChildren",
    }),
    user: one(usersTable, {
        fields: [foldersTable.userId],
        references: [usersTable.id],
    }),
    bookmarks: many(bookmarksTable),
}));

export const bookmarksRelations = relations(
    bookmarksTable,
    ({ one, many }) => ({
        folder: one(foldersTable, {
            fields: [bookmarksTable.folderId],
            references: [foldersTable.id],
        }),
        user: one(usersTable, {
            fields: [bookmarksTable.userId],
            references: [usersTable.id],
        }),
        tags: many(bookmarkToTagsTable),
    })
);

export const tagsRelations = relations(tagsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [tagsTable.userId],
        references: [usersTable.id],
    }),
    bookmarks: many(bookmarkToTagsTable),
}));

export const bookmarkToTagsRelations = relations(
    bookmarkToTagsTable,
    ({ one }) => ({
        bookmark: one(bookmarksTable, {
            fields: [bookmarkToTagsTable.bookmarkId],
            references: [bookmarksTable.id],
        }),
        tag: one(tagsTable, {
            fields: [bookmarkToTagsTable.tagId],
            references: [tagsTable.id],
        }),
    })
);
