import test from "node:test";
import assert from "node:assert/strict";

import {
  defaultLocale,
  getDictionary,
  isValidLocale,
  localizeHref,
  replaceLocaleInPathname,
} from "./i18n.ts";

test("isValidLocale only accepts supported locales", () => {
  assert.equal(isValidLocale("en"), true);
  assert.equal(isValidLocale("th"), true);
  assert.equal(isValidLocale("sv"), true);
  assert.equal(isValidLocale("de"), false);
});

test("replaceLocaleInPathname keeps the route suffix intact", () => {
  assert.equal(replaceLocaleInPathname("/en/about", "th"), "/th/about");
  assert.equal(replaceLocaleInPathname("/sv", "en"), "/en");
  assert.equal(replaceLocaleInPathname("/", "en"), "/en");
});

test("localizeHref prefixes internal paths with the active locale", () => {
  assert.equal(localizeHref("/products", "/th/about"), "/th/products");
  assert.equal(localizeHref("/product-detail", "/sv"), "/sv/product-detail");
  assert.equal(localizeHref("/en/contact", "/th/about"), "/en/contact");
});

test("getDictionary returns translated navigation labels", async () => {
  const en = await getDictionary("en");
  const th = await getDictionary("th");
  const sv = await getDictionary("sv");

  assert.equal(defaultLocale, "en");
  assert.equal(en.nav.shop, "Shop");
  assert.equal(th.nav.about, "เกี่ยวกับ");
  assert.equal(sv.nav.contact, "Kontakt");
});
