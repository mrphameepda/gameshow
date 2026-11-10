// src/data/sets/rcv-standard-set.ts
// Tác giả: Giuse Phạm Duy Ái, SDS
// BẢO TỒN THUẬT NGỮ: Giữ nguyên 100% từ ngữ trong câu hỏi và đáp án.

export type QuestionType = 'easy' | 'medium' | 'hard' | 'rescue' | 'final' | 'sos'

export interface RcvSetQuestion {
  q: string
  o: string[]  // o[0] luôn là đáp án đúng
}

export interface RcvQuestionSet {
  easy: RcvSetQuestion[]
  medium: RcvSetQuestion[]
  hard: RcvSetQuestion[]
  rescue: RcvSetQuestion[]
  final: RcvSetQuestion[]
  sos: RcvSetQuestion[]
}

export const rcvStandardSet: RcvQuestionSet = {
  // ──────────────────────────────────────────────────────────────────
  // CÂU DỄ
  // ──────────────────────────────────────────────────────────────────
  easy: [
    { q: "Điều răn nào quan trọng thứ hai sau yêu mến Thiên Chúa?", o: ["Yêu người như chính mình", "Không nói dối", "Kính trọng cha mẹ", "Thờ phượng thần tượng"] },
    { q: "Ân sủng là gì?", o: ["Sự trợ giúp của Thiên Chúa để sống thánh thiện", "Thưởng phạt đời sau", "Những luật lệ bắt buộc", "Phần thưởng vật chất"] },
    { q: "Thế nào là tội trọng?", o: ["Tội vi phạm nghiêm trọng luật Chúa với đầy đủ ý thức và tự do", "Tội nhẹ có thể tha ngay", "Những lỗi hành chính", "Tội vô ý"] },
    { q: "Ai là tác giả Tin Mừng Gioan?", o: ["Tông đồ Gioan, môn đệ Chúa yêu.", "Thánh Phao-lô.", "Thánh Lu-ca y sĩ.", "Thánh Gia-cô-bê hậu."] },
    { q: "Chúa Giêsu đã sống lại từ cõi chết vào ngày nào?", o: ["Ngày thứ nhất trong tuần (Chúa Nhật)", "Ngày thứ bảy (Sabát)", "Ngày thứ sáu tuần thánh", "Ngày cuối cùng của tháng"] },
    { q: "Đến bữa ăn ta phải làm gì để tỏ lòng hiếu kính?", o: ["Mời người lớn ăn, không ăn trước khi người lớn chưa ăn", "Ngồi vào chỗ mình thích nhất và ăn ngay", "Chỉ cần mời cha mẹ là đủ", "Lấy thức ăn cho mình trước rồi mới mời"] },
    { q: "Trước khi bắt đầu bữa ăn, người Kitô hữu phải làm gì?", o: ["Làm dấu thánh giá, đọc kinh cám ơn Chúa", "Kiểm tra xem món nào ngon nhất", "Bàn tán chuyện trường lớp", "Uống nước thật nhiều cho no bụng"] },
    { q: "Trong bữa ăn, điều gì sau đây được coi là lịch sự?", o: ["Không cáo tội nhau, không chê món ăn, không chọn miếng ngon nhất", "Nói chuyện thật to cho không khí vui vẻ", "Kể tội người khác để mọi người góp ý", "Gắp miếng ngon nhất cho mình"] },
    { q: "Điều gì sau đây là CẤM KỊ (vô lễ) trong bữa ăn?", o: ["Khạc nhổ, lấy tay móc thức ăn trong miệng ngửi", "Dùng đũa để gắp thức ăn cho người khác", "Uống nước canh bằng thìa (muỗng)", "Nói lời cảm ơn người nấu bếp"] },
    { q: "Khi khách đến nhà, chúng ta nên ứng xử thế nào?", o: ["Chào khách, mặc lịch sự, mời nước và giới thiệu người nhỏ cho người lớn", "Cứ ngồi tự nhiên vì là nhà mình", "Hỏi khách xem có mang quà gì không", "Để khách tự nhiên, không cần tiếp đón"] },
    { q: "Khi đến nhà người khác, hành vi nào là đúng?", o: ["Ấn chuông hoặc gõ cửa, đợi chủ nhà mời mới vào", "Mở cửa vào luôn vì là chỗ quen biết", "Đứng ngoài cổng gọi thật to tên chủ nhà", "Nhìn qua cửa sổ xem chủ nhà đang làm gì"] },
    { q: "Khi vào nhà thờ, cử chỉ nào thể hiện sự tôn kính?", o: ["Bái Chúa cung kính, đi đứng nghiêm trang, không ồn ào", "Chạy thật nhanh để giữ chỗ ngồi tốt", "Nói chuyện nhỏ tiếng về tin tức mới", "Tìm người quen để bắt tay chào hỏi"] },
    { q: "Nhân danh ai chúng ta đọc kinh xin ơn trong Thánh lễ?", o: ["Cha, Con và Thánh Thần", "Chúa Giêsu", "Maria", "Các thánh"] },
    { q: "Sau 'Phụng vụ Lời Chúa' là gì?", o: ["Phụng vụ Thánh Thể", "Phụng vụ Hiến Tế", "Phụng vụ Rước lễ", "Phụng vụ Thánh lễ"] },
    { q: "Trong Thánh lễ, Thánh Thần được gọi là gì?", o: ["Đấng Thánh", "Thiên thần", "Môn đệ", "Linh mục"] },
    { q: "Trong Thánh lễ, khi nào tín hữu đọc Kinh Tin Kính?", o: ["Sau bài giảng", "Trước bài đọc Tin Mừng", "Sau Phụng vụ Thánh Thể", "Trong khi hiệp lễ"] },
    { q: "Thánh lễ gồm mấy phần chính?", o: ["Hai: Phụng vụ Lời Chúa và Phụng vụ Thánh Thể", "Ba", "Một", "Bốn"] },
    { q: "Trong Thánh lễ, linh mục rửa tay trước khi cử hành Bí tích nhằm mục đích gì?", o: ["Thanh tẩy tâm hồn", "Vệ sinh cá nhân", "Kính trọng giáo dân", "Thể hiện truyền thống"] },
    { q: "Bí tích Thánh Thể do Chúa Giêsu thiết lập trong bữa ăn nào?", o: ["Bữa Tiệc Ly", "Bữa sáng tại Nazareth", "Bữa tối với các môn đệ", "Lễ Vượt Qua"] },
    { q: "Khi nào trong Thánh lễ tín hữu cử hành Rước Lễ?", o: ["Sau Phụng vụ Thánh Thể", "Sau Phụng vụ Lời Chúa", "Trước Phụng vụ Thánh Thể", "Trong phần chuẩn bị"] },
    { q: "Trong Thánh lễ, lời 'Chính nhờ Người, với Người và trong Người' nói về ai?", o: ["Chúa Kitô", "Chúa Cha", "Chúa Thánh Thần", "Maria"] },
    { q: "Trong Thánh lễ, tín hữu làm dấu thánh giá mấy lần?", o: ["Ba lần", "Một lần", "Hai lần", "Bốn lần"] },
    { q: "Từ 'Amen' nghĩa là gì?", o: ["Tôi tin như vậy", "Cầu nguyện xong", "Xin lỗi Chúa", "Hòa bình"] },
    { q: "Thánh lễ kết thúc bằng phần nào?", o: ["Lời nguyện kết lễ và sai đi", "Bài giảng", "Rước lễ", "Kinh Tin Kính"] },
    { q: "Trong Thánh lễ, khi nào đọc bài giảng?", o: ["Sau bài Tin Mừng", "Trước bài đọc Tân Ước", "Trước phần hiệp lễ", "Sau Kinh Tin Kính"] },
    { q: "Người tham dự Thánh lễ có trách nhiệm gì?", o: ["Cầu nguyện và tham dự Thánh lễ", "Ăn uống trong nhà thờ", "Đọc sách lịch sử", "Ghi chép bài giảng"] },
    { q: "Phụng vụ Lời Chúa gồm những phần nào?", o: ["Bài đọc, Tin Mừng, Bài giảng, Kinh Tin Kính", "Chỉ Tin Mừng", "Chỉ Kinh Tin Kính", "Chỉ bài đọc"] },
    { q: "Thánh lễ nào được cử hành thường xuyên nhất?", o: ["Thánh lễ Chúa Nhật", "Thánh lễ lễ trọng", "Thánh lễ riêng lẻ", "Thánh lễ lễ Tết"] },
    { q: "Trong Thánh lễ, chuỗi bài đọc nào thuộc Cựu Ước?", o: ["Bài đọc 1", "Tin Mừng", "Bài đọc 2", "Kinh Tin Kính"] },
    { q: "Khi nào linh mục nâng cao Mình Thánh Chúa?", o: ["Sau truyền phép", "Trước bài đọc", "Khi bắt đầu Thánh lễ", "Sau hiệp lễ"] },
    { q: "Thánh lễ được tổ chức ở đâu?", o: ["Nhà thờ", "Trường học", "Nhà riêng", "Ngoài trời"] },
    { q: "Trong Thánh lễ, ai làm phép bánh và rượu?", o: ["Linh mục", "Tín hữu", "Thiếu nhi", "Giáo dân"] },
    { q: "Trong Thánh lễ, bài giảng thuộc phần nào?", o: ["Phụng vụ Lời Chúa", "Phụng vụ Thánh Thể", "Hiệp lễ", "Kinh Tạ Ơn"] },
    { q: "Thánh lễ Chúa Nhật khác gì so với ngày thường?", o: ["Bắt buộc tham dự và đọc kinh đặc biệt", "Thời gian ngắn hơn", "Không đọc Kinh nhiều", "Không có hiệp lễ"] },
    { q: "Phụng vụ Thánh Thể gồm những phần nào?", o: ["Chuẩn bị lễ vật, truyền phép, Rước lễ, Kinh Tạ Ơn", "Bài giảng, Rước lễ", "Bài đọc, Tin Mừng", "Kinh nguyện"] },
    { q: "Khi đọc kinh 'Lạy Cha', ta nói điều gì?", o: ["Kính mến Thiên Chúa và xin ơn", "Kể lại lịch sử", "Hát bài hát", "Tường thuật sự kiện"] },
    { q: "Ai là Mẹ của Chúa Giêsu?", o: ["Maria", "Anna", "Isabel", "Martha"] },
    { q: "Chúa Giêsu sinh ra ở đâu?", o: ["Belem", "Nazareth", "Jerusalem", "Galilee"] },
    { q: "Trong năm Phụng vụ, màu sắc nào tượng trưng cho mùa Vui (Giáng Sinh, Phục Sinh)?", o: ["Màu Trắng", "Màu Tím", "Màu Đỏ", "Màu Xanh Lá"] },
    { q: "Bí tích nào là 'cửa ngõ' để gia nhập Giáo hội và làm con Chúa?", o: ["Bí tích Rửa Tội", "Bí tích Thêm Sức", "Bí tích Hôn Phối", "Bí tích Truyền Chức"] },
    { q: "Khi nhận được quà hoặc sự giúp đỡ, từ đầu tiên ta nên nói là gì?", o: ["Con cảm ơn / Em cảm ơn", "Cái này bao nhiêu tiền?", "Lần sau cho thêm nhé", "Im lặng nhận lấy"] },
    { q: "Ai đã làm phép rửa cho Chúa Giêsu?", o: ["Gioan Tẩy Giả", "Phêrô", "Phaolô", "Giacôbê"] },
    { q: "Chúa Giêsu có bao nhiêu Tông đồ?", o: ["12", "10", "7", "15"] },
    { q: "Ai phản bội Chúa Giêsu?", o: ["Giuđa Iscariốt", "Phêrô", "Gioan", "Mátthêu"] },
    { q: "Kinh Lạy Cha do ai dạy?", o: ["Chúa Giêsu", "Mô-sê", "Gioan Tẩy Giả", "Phêrô"] },
    { q: "Chúa Giêsu chết trên cây gì?", o: ["Thập giá", "Cây ôliu", "Cây dương", "Cây vả"] },
    { q: "Chúa Giêsu sống lại sau mấy ngày?", o: ["3", "1", "7", "40"] },
    { q: "Ai là Tông đồ được Chúa yêu nhất?", o: ["Gioan", "Giacôbê", "Phêrô", "Mátthêu"] },
    { q: "Chúa Giêsu lớn lên ở đâu?", o: ["Nazareth", "Jerusalem", "Belem", "Jericho"] },
    { q: "Chúa Giêsu làm nghề gì khi còn nhỏ?", o: ["Thợ mộc", "Ngư phủ", "Nông dân", "Thầy dạy"] },
    { q: "Chúa Giêsu yêu thương trẻ em hay không?", o: ["Có", "Không", "Chỉ đôi lúc", "Chỉ người lớn"] },
    { q: "Tha thứ là điều Chúa Giêsu có dạy không?", o: ["Có", "Không", "Chỉ với bạn bè", "Chỉ với gia đình"] },
    { q: "Mười Điều Răn do ai ban?", o: ["Thiên Chúa", "Thánh Phêrô", "Chúa Giêsu", "Phaolô"] },
    { q: "Kinh Thánh gồm mấy phần chính?", o: ["2", "1", "3", "4"] },
    { q: "Phần nói về Chúa Giêsu gọi là gì?", o: ["Tân Ước", "Cựu Ước", "Sáng Thế", "Thánh Vịnh"] },
    { q: "Ba Ngôi gồm những ai?", o: ["Chúa Cha, Chúa Con, Chúa Thánh Thần", "Chúa Cha, Chúa Con, Maria", "Chúa Giêsu, Thánh Phêrô", "Chúa Giêsu, Mẹ Maria"] },
    { q: "Ai là người đầu tiên nhìn thấy Chúa sống lại?", o: ["Maria Magdalen", "Phêrô", "Gioan", "Giacôbê"] },
    { q: "Chúa Giêsu làm phép lạ biến nước thành rượu ở đâu?", o: ["Cana", "Belem", "Jerusalem", "Nazareth"] },
    { q: "Khi vào nhà thờ, thấy bạn mình đang ngủ gật, ta nên làm gì?", o: ["Nhắc nhẹ bạn dậy để cùng tham dự Thánh lễ", "Quay phim đăng Tiktok", "Hát thật to vào tai bạn", "Kê gối cho bạn ngủ ngon"] },
    { q: "Trong bữa ăn, nếu thấy miếng đùi gà ngon nhất, người lịch sự sẽ làm gì?", o: ["Gắp mời người lớn tuổi nhất trong bàn", "Gắp ngay bỏ vào túi quần", "Dùng tay bốc nhanh", "Liếm để đánh dấu chủ quyền"] },
    { q: "Nếu lỡ tay làm vỡ bình hoa của mẹ, từ nào là 'phép thuật' nhất?", o: ["Con xin lỗi mẹ!", "Tại con mèo đấy!", "Bình cũ rồi mẹ ơi", "Con làm thí nghiệm vật lý"] },
    { q: "Tiếng chuông nhà thờ trước Thánh lễ có ý nghĩa gì?", o: ["Chúa mời gọi con cái đến dự tiệc Thánh Thể", "Nhắc mọi người phải ngưng việc để đi lễ", "Nhắc mọi người không được ăn uống gì nữa", "Báo sắp sửa có Thánh lễ"] },
    { q: "Trong kinh thú tội, đọc tới câu 'lỗi tại tôi...', ta đấm ngực mấy lần?", o: ["Đấm ngực 3 lần", "Đấm ngực 1 lần", "Đấm ngực 2 lần", "Không cần đấm ngực"] },
    { q: "Trong Thánh lễ, ai đọc Kinh thú tội (Kinh cáo mình)?", o: ["Toàn cộng đoàn", "Những người mắc tội nhẹ", "Những người mắc tội nặng", "Đàn ông"] },
    { q: "Tại sao cộng đoàn đứng lên khi nghe công bố Tin Mừng?", o: ["Vì khi ấy, chính Chúa Kitô nói trực tiếp với cộng đoàn", "Linh mục bảo đứng lên", "Vì chính linh mục công bố Tin Mừng", "Đứng lên cho khỏi buồn ngủ"] },
    { q: "Trong Lời nguyện tín hữu, chúng ta cầu nguyện cho ai?", o: ["Cầu cho tất cả mọi người (Giáo hội, xã hội, người đau khổ...)", "Chỉ cầu cho người Công giáo", "Chỉ cầu cho các linh hồn", "Chỉ cầu cho giáo xứ mình"] },
    { q: "Sau lời truyền phép, Linh mục giơ cao Mình và Máu Thánh để làm gì?", o: ["Để mọi người thấy và thờ lạy", "Để mọi người xem cho rõ", "Để mọi người cầu nguyện cho biến thành Mình Máu thật"] },
    { q: "Trong Thánh lễ, ai đọc câu 'Thầy ban bình an của Thầy cho các con'?", o: ["Vị chủ tế", "Chúa Giêsu", "Một cha đồng tế"] },
    { q: "Nghi thức chúc bình an trong Thánh lễ là gì?", o: ["Dấu chỉ hiệp thông trong sự bình an và tình yêu", "Chúc sức khỏe", "Chúc xã giao"] },
    { q: "Khi rước lễ, giáo dân có được tự đến lấy bánh thánh không?", o: ["Không, phải đón nhận từ người thừa tác viên", "Được, vì Chúa bảo thế", "Được, cho lễ ngắn hơn", "Được, vì tay ai cũng sạch"] },
    { q: "Thừa tác viên nói 'Mình Thánh Chúa Kitô', người rước lễ thưa gì?", o: ["Amen", "Cảm ơn cha", "Tạ ơn Chúa", "Xin ngự vào lòng con"] },
    { q: "Người Công Giáo có được 'rước lễ' ở nhà thờ Tin Lành không?", o: ["Không", "Có", "Tùy trường hợp", "Nếu thích thì rước"] },
    { q: "Dự lễ qua tivi/radio có thay thế Thánh lễ nhà thờ được không?", o: ["Tùy hoàn cảnh: cho bệnh nhân/người bất khả kháng; người khỏe thì không", "Được nhưng phải có giấy khám bệnh", "Không được trong mọi trường hợp", "Chơi thân với cha thì được"] },
    { q: "Thánh lễ có ý nghĩa gì đối với Kitô hữu?", o: ["Là nguồn mạch và chóp đỉnh đời sống Kitô giáo", "Chỉ là một nghi thức", "Chu toàn là bổn phận", "Khỏi vào Hỏa ngục"] },
  ],

  // ──────────────────────────────────────────────────────────────────
  // CÂU VỪA
  // ──────────────────────────────────────────────────────────────────
  medium: [
    { q: "Tân Ước gồm bao nhiêu cuốn và viết bằng tiếng gì?", o: ["27 cuốn, tiếng Hy Lạp phổ thông", "46 cuốn, tiếng Do Thái", "12 cuốn, tiếng La-tinh"] },
    { q: "Sách Công Vụ Tông Đồ kể lại điều gì?", o: ["Buổi đầu của Giáo Hội và việc loan báo Tin Mừng", "Cuộc đời Chúa Giêsu", "Thị kiến tận thế"] },
    { q: "Hát bao nhiêu lần 'Lạy Chiên Thiên Chúa...' trước khi hát câu kết?", o: ["Nhiều lần cho đến khi bẻ bánh xong", "2 lần", "3 lần"] },
    { q: "Quyên tiền trong Thánh lễ có phải là nghi thức cần thiết không?", o: ["Có, là dấu chỉ tham dự và liên đới", "Không, Giáo hội nhiều tiền", "Thủ tục hành chính", "Tùy nhà thờ"] },
    { q: "Tại sao ngôn ngữ phụng vụ đôi khi khó hiểu với ngày nay?", o: ["Vì cần đào sâu để hiểu tính linh thiêng và truyền thống", "Vì ngôn ngữ nay quá tiến bộ", "Vì không có ý nghĩa gì"] },
    { q: "Thánh lễ bắt nguồn từ đâu?", o: ["Bữa Tiệc Ly", "Bữa tiệc vượt qua của người Do-thái", "Giáo Hội tiên khởi", "Thánh lễ hiện nay"] },
    { q: "Lễ Vượt Qua của người Do-thái nhắc đến sự kiện gì?", o: ["Thoát khỏi Ai Cập", "Sinh nhật Moses", "Xây đền thờ", "Cầu nguyện tại sa mạc"] },
    { q: "Khi nào linh mục chúc bình an trong Thánh lễ?", o: ["Trước hiệp lễ", "Sau bài giảng", "Sau Phụng vụ Thánh Thể", "Trước bài đọc Tin Mừng"] },
    { q: "Chữ 'Gloria' nghĩa là gì?", o: ["Vinh danh Chúa", "Cầu nguyện", "Tha tội", "Hiệp lễ"] },
    { q: "Trong Thánh lễ, Kinh Tiền Tụng đọc khi nào?", o: ["Phần mở đầu Phụng vụ Thánh Thể", "Sau hiệp lễ", "Trước bài giảng", "Trong Phụng vụ Lời Chúa"] },
    { q: "Qua Kinh Thánh, vũ trụ mang dấu vết của ai?", o: ["Của Thiên Chúa.", "Của các thần linh trong thiên nhiên.", "Của sự ngẫu nhiên.", "Của con người tiền sử."] },
    { q: "Thiên Chúa dùng các Ngôn sứ để chuẩn bị điều gì?", o: ["Cho Ngôi Lời xuất hiện vào thời viên mãn.", "Cho dân chúng xây Đền thờ nguy nga.", "Cho cuộc chiến tranh giải phóng.", "Cho việc soạn bộ luật Do Thái mới."] },
    { q: "Biến cố xuất hành khỏi Ai-cập hướng đến việc gì?", o: ["Giải phóng con người khỏi ách nô lệ tội lỗi.", "Tìm kiếm vùng đất có nhiều vàng bạc.", "Xây dựng đế chế mạnh hơn Ai-cập.", "Mở mang giao thương bang giao."] },
    { q: "Các Thư trong Tân Ước được soạn thảo do đâu?", o: ["Do ơn Linh Hứng của Chúa Thánh Thần.", "Do các Tông đồ tự ý ghi chép.", "Do các sử gia sưu tầm.", "Do sự chỉ đạo của hoàng đế La Mã."] },
    { q: "Với giáo hội sơ khai, các Thư phản ánh điều gì?", o: ["Việc sống Lời Chúa của cộng đoàn đầu tiên.", "Các cuộc tranh chấp quyền lực.", "Kỹ thuật in ấn thời bấy giờ.", "Các quy tắc xây dựng nhà thờ."] },
    { q: "Vùng đất Pa-let-tin thời Chúa Giêsu có mấy phần chính?", o: ["3 phần: Galilê, Samari và Giu-đê.", "2 phần: Bắc và Nam.", "4 phần: Đông, Tây, Nam, Bắc.", "3 phần: Ai Cập, Ba Tư và La Mã."] },
    { q: "Khi Chúa Giêsu chào đời, ai trị vì Đế quốc Roma?", o: ["Hoàng đế Au-gut-tô.", "Hoàng đế Hê-rô-đê.", "Hoàng đế Nê-rô.", "Hoàng đế Ti-bê-ri-ô."] },
    { q: "Các giai cấp điển hình xã hội Do thái thời Chúa Giêsu là?", o: ["Giới Tư tế, Kinh sư, Kỳ mục và Dân chúng.", "Hoàng gia, Quan lại và Nô lệ.", "Quân đội, Triết gia và Nghệ sĩ.", "Địa chủ, Công nhân và Ngoại kiều."] },
    { q: "Kinh Sư trong xã hội Do Thái cổ là những người thế nào?", o: ["Chuyên về Kinh Thánh và Luật pháp Do Thái.", "Chuyên về việc tế tự trong đền thờ.", "Chuyên về việc buôn bán và thu thuế.", "Chuyên về việc cai trị quân đội."] },
    { q: "Giới Kỳ Mục thời bấy giờ là những ai?", o: ["Bậc niên trưởng hoặc những người phú ông.", "Người trẻ tuổi tài năng quân sự.", "Người nghèo khổ sống nhờ bố thí.", "Người ngoại đạo sống trong xứ."] },
    { q: "Đền thờ đóng vai trò gì đối với người Do Thái?", o: ["Là trung tâm đời sống Tôn giáo.", "Chỉ là một di tích lịch sử.", "Là nơi hội họp chính trị.", "Là nơi tổ chức thể thao."] },
    { q: "Ba dịp lễ lớn hàng năm của người Do Thái là gì?", o: ["Lễ Vượt Qua, lễ Ngũ Tuần và lễ Lều.", "Lễ Giáng Sinh, Phục Sinh và Hiện Xuống.", "Lễ Năm Mới, Trăng Rằm và Mùa Gặt.", "Lễ Giải Phóng, Chiến Thắng và Độc Lập."] },
    { q: "Ba dịp lễ chính (Vượt Qua, Ngũ Tuần, Lều) nhắc người Do Thái nhớ điều gì?", o: ["Lần Thiên Chúa can thiệp giải phóng dân Người.", "Phải đóng thuế cho đền thờ đầy đủ.", "Về sự giàu có của tổ tiên.", "Phải chuẩn bị cho mùa màng."] },
    { q: "Tin Mừng Mac-cô soạn thảo năm nào, ở đâu?", o: ["Trước năm 70, tại Roma.", "Năm 100, tại Giêrusalem.", "Khoảng năm 30, tại Galilê.", "Trước năm 50, tại Ai-cập."] },
    { q: "Tin Mừng thứ 3 (Luca) được soạn ở đâu, khi nào?", o: ["Tại Rôma, sau năm 70.", "Tại Nadarét, năm 33.", "Tại Hi Lạp, trước năm 40.", "Tại Ấn Độ, năm 90."] },
    { q: "Chủ đề trung tâm của Tin Mừng Mat-thêu là gì?", o: ["Là Nước Trời.", "Là Sự thật và Sự sống.", "Là Sự nghèo khó của tâm hồn.", "Là Các phép lạ của Chúa Giêsu."] },
    { q: "Mục đích chính của Mat-thêu khi viết Tin Mừng là?", o: ["Trình bày con người và sự nghiệp Đức Giêsu.", "Để phê phán chính quyền La Mã.", "Để hướng dẫn tổ chức giáo phận.", "Để ghi chép lịch sử dân tộc Do Thái."] },
    { q: "Đạo lý chính yếu của Tin Mừng Mat-thêu là gì?", o: ["Đức Giêsu là Đấng Mê-si-a và Con Thiên Chúa.", "Đức Giêsu là nhà triết học vĩ đại.", "Đức Giêsu là người giải phóng chính trị.", "Đức Giêsu là vị ngôn sứ cuối cùng."] },
    { q: "Thánh Mac-cô dùng lối văn nào để trình bày?", o: ["Lối văn kể chuyện sinh động.", "Lối văn thơ ca trữ tình.", "Lối văn nghị luận sắc bén.", "Lối văn pháp lý khô khan."] },
    { q: "Ai là vị thánh bảo trợ các nhà thần học và triết học?", o: ["Thánh Thomas Aquinas", "Thánh Augustinô", "Thánh Inhaxiô Loyola", "Thánh Phêrô"] },
    { q: "Chu kỳ bài đọc Thánh lễ Chúa nhật được gọi là gì?", o: ["Năm A, năm B, năm C", "Năm 1, 2, 3", "Năm Chúa Cha, Con, Thánh Thần"] },
    { q: "Chu kỳ bài đọc Thánh lễ ngày trong tuần được gọi là gì?", o: ["Năm chẵn, năm lẻ", "Năm 1, năm 2", "Năm An-pha, Ô-mê-ga"] },
    { q: "Trong lễ Chúa nhật, bài đọc I thường lấy từ đâu?", o: ["Luôn lấy từ Cựu Ước (trừ mùa Phục Sinh)", "Luôn lấy từ Cựu Ước", "Luôn lấy từ Tân Ước"] },
    { q: "Bài Thánh vịnh đáp ca sau bài đọc I có vai trò gì?", o: ["Lời đáp của cộng đoàn đối với Lời Chúa", "Chọn theo ý Tin Mừng", "Gạch nối bài đọc"] },
    { q: "Câu 'Kyrie eleison' thuộc ngôn ngữ nào?", o: ["Tiếng Hy-lạp", "Tiếng La-tinh", "Tiếng Do-thái", "Tiếng Nhật"] },
    { q: "Nghĩa đúng nhất của từ 'Amen' là gì?", o: ["Sự chắc chắn và trung tín của Chúa", "Ước gì được như vậy", "Sự kết thúc bài kinh", "Chấp nhận mọi điều"] },
    { q: "Nghĩa chính xác của từ 'Halêluia' là gì?", o: ["Hãy ngợi khen Chúa", "Thêm Trang nghiêm", "Sự phục sinh", "Mừng vui lên"] },
    { q: "Từ nào ý nghĩa nhất để nói về Thánh lễ?", o: ["Hy lễ tạ ơn", "Hy lễ", "Thánh lễ", "Lễ Mixa"] },
    { q: "Trong 'Lễ bẻ bánh' thời sơ khai có phần Tin Mừng không?", o: ["Không, vì các sách Tin Mừng chưa soạn xong", "Dĩ nhiên là có", "Lúc có lúc không", "Không thấy sách nào nói"] },
    { q: "Câu nào sau đây CHỈ có linh mục chủ tế được đọc?", o: ["Lạy Chúa Giêsu Kitô, Chúa đã nói với các Tông Đồ...", "Và bình an dưới thế...", "Lạy Cha chúng con...", "Và cùng với thần trí cha"] },
    { q: "Bí tích nào là nền tảng cho tất cả các Bí tích khác?", o: ["Rửa tội", "Thánh Thể", "Xức dầu tội nhân", "Hôn phối"] },
    { q: "Bí tích Xức dầu bệnh nhân giúp con người nhận được gì?", o: ["Tha tội và nâng đỡ sức khỏe tinh thần và thể xác", "Phép lành cho gia đình", "Dự trữ phúc lành cho sau này", "Chứng nhận tín hữu"] },
    { q: "Bí tích Hôn phối có mấy đặc tính?", o: ["Hai: Đơn nhất và bất khả phân ly", "Một: tình yêu", "Ba: Bất khả phân ly, tình yêu, Đơn nhất", "Bốn: Đơn nhất, Bất khả phân ly, bí tích, con cái"] },
    { q: "Thánh Thể là gì?", o: ["Mình và Máu Chúa Giêsu thật sự hiện diện", "Một biểu tượng tinh thần", "Một bữa ăn tượng trưng", "Một lời cầu nguyện"] },
    { q: "Giáo Hội được lập ra với mục đích gì?", o: ["Đem ơn cứu độ cho mọi người", "Chỉ bảo vệ tín hữu", "Lưu trữ sách thánh", "Xây dựng các giáo đường"] },
    { q: "Chức Linh mục được trao quyền gì?", o: ["Cử hành các Bí tích và rao giảng Tin Mừng", "Quản lý tài sản giáo xứ", "Chỉ dạy giáo lý trẻ em", "Tổ chức lễ hội tôn giáo"] },
  ],

  // ──────────────────────────────────────────────────────────────────
  // CÂU KHÓ
  // ──────────────────────────────────────────────────────────────────
  hard: [
    { q: "Ai là vị thánh bảo trợ các nhà thần học và triết học?", o: ["Thánh Thomas Aquinas", "Thánh Augustinô", "Thánh Inhaxiô Loyola", "Thánh Phêrô"] },
    { q: "Ai là người lập Dòng Tên (Jesuits)?", o: ["Thánh Inhaxiô Loyola", "Thánh Phanxicô Assisi", "Thánh Thomas Aquinas", "Thánh Gioan"] },
    { q: "Ai là Giáo Hoàng lập Công Đồng Vatican II?", o: ["Gioan XXIII", "Piô XII", "Phaolô VI", "Benedict XVI"] },
    { q: "Ai là người chủ trì soạn thảo bộ Giáo Lý Hội Thánh Công Giáo 1992?", o: ["Ủy Ban Giáo Lý Hội Thánh", "Thánh Thomas Aquinas", "Thánh Giêrômê", "Thánh Augustinô"] },
    { q: "Ai là người viết sách Khôn Ngoan?", o: ["Thánh Vua Solomon", "Mô-sê", "Phaolô", "Gioan"] },
    { q: "Ai là người tiên tri đã bị cá nuốt?", o: ["Giôna", "Êlia", "Isaia", "Giêrêmia"] },
    { q: "Ai là người lãnh đạo dân Israel khi vượt Biển Đỏ?", o: ["Mô-sê", "Joshua", "Áp-ra-ham", "Đavít"] },
    { q: "Ai là vị thánh được Chúa chọn giữ Đền Thờ khi còn trẻ?", o: ["Samuen", "Gioan", "Phêrô", "Phaolô"] },
    { q: "Ai là tác giả sách Khải Huyền?", o: ["Thánh Gioan", "Thánh Phaolô", "Thánh Phêrô", "Thánh Mátthêu"] },
    { q: "Ai là vị thánh đã gặp Chúa Giêsu trên đường Damascus?", o: ["Thánh Phaolô", "Phêrô", "Gioan", "Mátthêu"] },
    { q: "Ai là người đã viết thư gửi tín hữu Galatia?", o: ["Phaolô", "Phêrô", "Gioan", "Mátthêu"] },
    { q: "Ai là người lập Giáo Hội tại Rome?", o: ["Phêrô", "Phaolô", "Gioan", "Mátthêu"] },
    { q: "Ai là vị thánh quan thầy của các nhà truyền giáo?", o: ["Thánh Phanxicô Xaviê", "Thánh Phêrô", "Thánh Gioan", "Thánh Mátthêu"] },
    { q: "Ai là người đã dâng lễ sinh của Chúa Giêsu tại Đền Thờ?", o: ["Simeon", "Anna", "Maria", "Phêrô"] },
    { q: "Ai là vị tiên tri đã tiên báo về Người Tôi Trung đau khổ chịu chết?", o: ["Isaia", "Giêrêmia", "Êlia", "Ezekiel"] },
    { q: "Ai là người dẫn Chúa Giêsu vào thành Jerusalem trên lưng lừa?", o: ["Các môn đệ", "Dân chúng", "Phêrô", "Maria"] },
    { q: "Ai là vị vua Israel xây đền thờ đầu tiên?", o: ["Solomon", "Đavít", "Saul", "Mô-sê"] },
    { q: "Ai là người tiên tri gọi vua Achab và Jezebel ăn năn?", o: ["Elia", "Isaia", "Jeremiah", "Ezekiel"] },
    { q: "Ai là người được Thiên Chúa ban cho giấc mơ giải nghĩa tại Ai Cập?", o: ["Giuse", "Mô-sê", "Daniel", "David"] },
    { q: "Ai là người dâng con trai Isaac lên để thử lòng tin kính?", o: ["Áp-ra-ham", "Mô-sê", "David", "Noah"] },
    { q: "Ai là người giải cứu Daniel khỏi hang sư tử?", o: ["Thiên Chúa", "Đavít", "Mô-sê", "Gioan"] },
    { q: "Ai là người sáng lập Dòng Thừa Sai Phanxicô (OFM)?", o: ["Thánh Phanxicô Assisi", "Thánh Gioan Phaolô II", "Thánh Têrêsa Avila", "Thánh Augustinô"] },
    { q: "Ai là người biên soạn Kinh Thánh Latinh (Vulgata)?", o: ["Thánh Giêrômê", "Thánh Augustinô", "Thánh Thomas Aquinas", "Thánh Phêrô"] },
    { q: "Ai là người phụ nữ đầu tiên được phong Tiến sĩ Hội Thánh?", o: ["Thánh Thê-rê-sa Avila", "Thánh Catarina thành Siena", "Thánh Thê-rê-sa Hài Đồng Giêsu", "Thánh Hildegard"] },
    { q: "Ai là người lập Dòng Nữ Tử Bác Ái?", o: ["Thánh Vinh Sơn Phaolô và Thánh Louise de Marillac", "Thánh Têrêsa Calcutta", "Thánh Phanxicô", "Thánh Augustinô"] },
    { q: "Ai là vị thánh bảo trợ các trẻ em?", o: ["Thánh Têrêsa Hài Đồng Giêsu", "Thánh Phêrô", "Thánh Phaolô", "Thánh Gioan"] },
    { q: "Có được dùng giảng đài để thông báo, rao hôn phối không?", o: ["Không được (Giảng đài chỉ dành cho Lời Chúa)", "Được"] },
    { q: "Trong lễ có Giám mục và Linh mục đồng tế, ai công bố Tin Mừng?", o: ["Linh mục", "Giám mục"] },
    { q: "Tin Mừng nào KHÔNG bao giờ được đọc trong các ngày trong tuần?", o: ["Tin Mừng theo thánh Gio-an (Trừ các mùa đặc biệt)", "Thánh Mát-thêu", "Thánh Mác-cô", "Thánh Lu-ca"] },
    { q: "Ai thực sự thánh hiến bánh rượu thành Mình Máu Chúa Kitô?", o: ["Chúa Kitô (thông qua tác vụ linh mục)", "Linh mục", "Chúa Cha", "Chúa Ba Ngôi"] },
    { q: "Ai được phép đọc/hát Vinh tụng ca 'Chính nhờ Người...'?", o: ["Linh mục chủ tế và các linh mục đồng tế", "Phó tế", "Giúp lễ", "Giáo dân"] },
    { q: "Trong Kinh Lạy Cha, câu nào thường bị viết hoặc đọc sai từ?", o: ["cho - Chúa - xa (nợ chúng con - để chúng con...)", "1 từ sai", "2 từ sai", "4 từ sai"] },
    { q: "Sau Kinh Lạy Cha, từ 'bình an' xuất hiện bao nhiêu lần?", o: ["3 lần", "8 lần", "5 lần", "7 lần"] },
    { q: "Điền từ: 'Xin đoái thương ban cho [...] được bình an và hợp nhất...'", o: ["Hội Thánh", "Chúng con", "Giáo xứ", "Giáo hội"] },
    { q: "Trước khi đọc bài Tin Mừng, linh mục cúi đầu trước bàn thờ đọc gì?", o: ["Lạy Thiên Chúa toàn năng, xin tẩy sạch lòng và môi miệng con...", "Lạy Chúa xin thương xót...", "Lạy Cha, con đây xin phụng sự Ngài", "Xin Chúa Thánh Thần soi sáng con"] },
    { q: "Ai đặt ra ngày 25 tháng 12 là lễ Giáng Sinh?", o: ["Giáo Hội vào thế kỷ IV tại Rôma", "Thánh Phêrô", "Chúa Giêsu chỉ định", "Hoàng đế Contantin"] },
    { q: "Bao nhiêu cuốn sách trong Cựu Ước?", o: ["46 cuốn", "39 cuốn", "27 cuốn", "33 cuốn"] },
    { q: "Sách nào mở đầu Kinh Thánh?", o: ["Sáng thế ký", "Xuất Hành", "Thánh vịnh", "Gióp"] },
    { q: "Trong nghi thức Rửa tội, nước mang ý nghĩa gì?", o: ["Sự chết đi cho tội lỗi và sống lại với Chúa Kitô", "Tẩy rửa thể xác", "Chào đón vào cộng đoàn", "Vệ sinh trước khi vào Giáo hội"] },
  ],

  // ──────────────────────────────────────────────────────────────────
  // CỨU TRỢ
  // ──────────────────────────────────────────────────────────────────
  rescue: [
    { q: "Lễ Phục Sinh kỷ niệm điều gì?", o: ["Chúa Giêsu sống lại từ cõi chết", "Chúa Giêsu giáng trần", "Chúa Thánh Thần hiện xuống", "Chúa Giêsu lên trời"] },
    { q: "Bí tích nào tha tội sau Rửa Tội?", o: ["Hòa Giải (Xưng Tội)", "Thánh Thể", "Thêm Sức", "Xức Dầu"] },
    { q: "Lễ Hiện Xuống (Lễ Ngũ Tuần) kỷ niệm điều gì?", o: ["Chúa Thánh Thần hiện xuống trên các Tông Đồ", "Chúa Giêsu lên trời", "Chúa Giêsu sống lại", "Chúa Giêsu giáng sinh"] },
    { q: "Mùa Chay kéo dài bao nhiêu ngày?", o: ["40 ngày", "30 ngày", "50 ngày", "7 ngày"] },
    { q: "Đức Giáo Hoàng hiện tại đứng đầu Giáo Hội nào?", o: ["Giáo Hội Công Giáo Roma", "Giáo Hội Chính Thống", "Giáo Hội Anh Giáo", "Giáo Hội Tin Lành"] },
    { q: "Chúa Giêsu có bao nhiêu anh chị em ruột thịt theo Kinh Thánh Công Giáo?", o: ["Không có", "2", "4", "6"] },
    { q: "Ai là người mẹ đỡ đầu tinh thần của Giáo Hội Công Giáo?", o: ["Đức Maria", "Thánh Têrêsa", "Thánh Catarina", "Thánh Mađalêna"] },
    { q: "Số Bí tích trong Giáo Hội Công Giáo là bao nhiêu?", o: ["7", "5", "3", "10"] },
    { q: "Phép Thánh Thể gồm những phần tử nào?", o: ["Bánh và rượu trở thành Mình và Máu Chúa", "Nước và dầu", "Bánh và nước", "Rượu và muối"] },
    { q: "Câu 'Thiên Chúa là tình yêu' có trong sách nào của Kinh Thánh?", o: ["Thư thứ nhất của Gioan (1 Ga 4,8)", "Tin Mừng Gioan", "Thư gửi người Rôma", "Sách Khôn Ngoan"] },
  ],

  // ──────────────────────────────────────────────────────────────────
  // CÂU PHỤ (FINAL)
  // ──────────────────────────────────────────────────────────────────
  final: [
    { q: "Kinh Thánh Công Giáo gồm bao nhiêu cuốn tất cả?", o: ["73 cuốn", "66 cuốn", "80 cuốn", "27 cuốn"] },
    { q: "Đâu là câu Kinh Thánh ngắn nhất?", o: ["Chúa Giêsu khóc. (Ga 11,35)", "Hãy yêu nhau. (Ga 15,17)", "Hãy vui lên. (Pl 4,4)", "Cầu nguyện luôn. (1Tx 5,17)"] },
    { q: "Trong Thánh lễ, phần Phụng Vụ Lời Chúa thường có bao nhiêu bài đọc vào Chúa Nhật?", o: ["3 (Bài đọc 1, Bài đọc 2, Tin Mừng)", "1", "2", "4"] },
    { q: "Sách Thánh Vịnh gồm bao nhiêu bài?", o: ["150", "100", "200", "50"] },
    { q: "Công Đồng Vaticanô II kết thúc năm nào?", o: ["1965", "1962", "1970", "1960"] },
    { q: "Tên đầy đủ của Chúa Thánh Thần trong Kinh Tin Kính Nicêa – Constantinôpôli là gì?", o: ["Chúa Thánh Thần là Thiên Chúa, Đấng ban sự sống, Đấng xuất phát từ Chúa Cha và Chúa Con", "Chúa Thánh Thần là Ngôi Ba", "Đấng Bảo Trợ", "Thần Khí Thiên Chúa"] },
    { q: "Thánh Giuse là bổn mạng của ai?", o: ["Toàn thể Giáo Hội Hoàn Vũ, người lao động và người hấp hối", "Các linh mục", "Các bà mẹ", "Các trẻ em"] },
    { q: "Sự kiện 'Nhập Thể' có nghĩa là gì?", o: ["Ngôi Lời Thiên Chúa mặc lấy xác phàm trong cung lòng Đức Maria", "Chúa Thánh Thần hiện xuống", "Chúa Giêsu sống lại", "Chúa Giêsu chịu phép rửa"] },
    { q: "Tín điều 'Vô Nhiễm Nguyên Tội' được Đức Giáo Hoàng nào công bố?", o: ["Đức Piô IX, năm 1854", "Đức Phaolô VI, năm 1965", "Đức Gioan XXIII, năm 1962", "Đức Lêô XIII, năm 1891"] },
    { q: "Tín điều 'Đức Maria Hồn Xác Lên Trời' được Đức Giáo Hoàng nào công bố, năm nào?", o: ["Đức Piô XII, năm 1950", "Đức Piô IX, năm 1854", "Đức Phaolô VI, năm 1964", "Đức Gioan XXIII, năm 1963"] },
  ],

  // ──────────────────────────────────────────────────────────────────
  // ĐỐ VUI (SOS)
  // ──────────────────────────────────────────────────────────────────
  sos: [
    { q: "Con gà trống gáy 'ò ó o' thì thường làm gì tiếp theo?", o: ["Không làm gì vì gà không biết nói 'tiếp theo'", "Ăn thêm thóc", "Đẻ trứng", "Bay lên mái nhà"] },
    { q: "Nếu bạn ném một viên đá vào biển, điều gì xảy ra?", o: ["Biển ướt hơn", "Biển trở nên mặn hơn", "Biển nổi sóng to", "Không có gì xảy ra"] },
    { q: "Thứ gì luôn đến nhưng không bao giờ đến nơi?", o: ["Ngày mai", "Tàu hỏa", "Thư tình", "Mùa hè"] },
    { q: "Vừa bằng ngón tay nhưng cao hơn cây không với tới được?", o: ["Ngôi sao / Mặt trăng", "Núi cao", "Cầu vồng", "Mây"] },
    { q: "Chúa Giêsu bảo phải yêu kẻ thù. Vậy nếu bạn ghét Toán học, theo lý thuyết Chúa dạy, bạn phải làm gì?", o: ["Yêu môn Toán hơn và chăm chỉ học", "Không học nữa", "Bỏ trường", "Cầu xin Chúa xóa môn Toán"] },
    { q: "Thứ gì đi mà không cần chân, nói mà không có miệng?", o: ["Thời gian / Đồng hồ / Thư", "Gió", "Mây", "Sóng biển"] },
    { q: "Con gì đứng một chân ngủ?", o: ["Con cò", "Con vịt", "Con hạc", "Con bồ câu"] },
    { q: "Trong nhà thờ, ghế ngồi ở đâu là tốt nhất để… ngủ mà cha không thấy?", o: ["Không có ghế nào tốt vì Chúa thấy hết!", "Hàng cuối", "Hàng giữa", "Góc trái"] },
    { q: "Nếu Giuđa có điện thoại, ông sẽ... làm gì thay vì phản bội bằng cái hôn?", o: ["Chụp hình selfie với Chúa Giêsu rồi tag vị trí", "Gọi điện báo", "Nhắn tin cho lính", "Dùng Google Maps"] },
    { q: "Chúa Giêsu đi trên mặt nước. Nếu Ngài sống ngày nay, điều đó sẽ được gọi là gì?", o: ["Miracle (phép lạ viral trên mạng xã hội)", "Lướt ván", "Đi giày chống thấm", "Kỹ thuật số"] },
  ],
}

// Labels hiển thị cho từng loại câu hỏi
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  easy:   'CÂU DỄ',
  medium: 'CÂU VỪA',
  hard:   'CÂU KHÓ',
  rescue: 'CỨU TRỢ',
  final:  'CÂU PHỤ',
  sos:    'ĐỐ VUI',
}

export const QUESTION_TYPE_COLORS: Record<QuestionType, string> = {
  easy:   '#2ecc71',
  medium: '#2196f3',
  hard:   '#ff5252',
  rescue: '#ff9800',
  final:  '#9c27b0',
  sos:    '#f59e0b',
}
