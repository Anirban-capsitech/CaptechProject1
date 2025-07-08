namespace UserApplication.Entities
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public long PhoneNo { get; set; }
        public string? BillNo { get; set; }
        public int? slNo { get; set; }
    }
}
