namespace AlRaneem.Website.Shared
{
    public static class Helper
    {
        public static byte[] ConvertImageToByteArray(string imagePath)
        {
            return File.ReadAllBytes(imagePath);
        }
    }
}
