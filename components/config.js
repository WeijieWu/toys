const config = {
  cache_expired: 10 * 60 * 1000,
  messageTime: 4,
};
if (process.env.NODE_ENV === "production") {
  config.basePath = "/admin/";
} else {
  config.basePath = "/admin/";
}
if (process.env.BASE_PATH_ENTERPRISE) {
  config.basePath = process.env.BASE_PATH_ENTERPRISE;
}

module.exports = config;
