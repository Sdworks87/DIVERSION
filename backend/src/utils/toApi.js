function toApi(doc) {
  if (doc == null) return doc;
  if (Array.isArray(doc)) return doc.map(toApi);
  const out = doc.toObject ? doc.toObject() : { ...doc };
  out.id = out._id && out._id.toString ? out._id.toString() : out._id;
  delete out._id;
  return out;
}

module.exports = { toApi };
