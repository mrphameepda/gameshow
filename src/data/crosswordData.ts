import type { CrosswordClue } from '../utils/crosswordValidator';

export type { CrosswordClue };

export interface CrosswordLevel {
  id: number;
  tier: number;
  title: string;
  timeLimit: number;
  keyword: string;
  holyQuote?: string;
  gridRows: number;
  gridCols: number;
  clues: CrosswordClue[];
}

export const CROSSWORD_LEVELS: CrosswordLevel[] = [
  {
    "id": 1,
    "tier": 1,
    "title": "THIÊN CHÚA TẠO DỰNG",
    "keyword": "TẠO DỰNG",
    "timeLimit": 120,
    "clues": [
      { "id": 1, "number": 1, "clue": "Thiên Chúa dựng nên ánh sáng vào ngày thứ mấy?", "answer": "NHAT", "direction": "down", "row": 0, "col": 3 },
      { "id": 2, "number": 2, "clue": "Thiên Chúa dựng nên các tinh tú vào ngày thứ...?", "answer": "TU", "direction": "across", "row": 3, "col": 3 },
      { "id": 4, "number": 3, "clue": "Thiên Chúa dựng nên người nam đầu tiên và đặt tên là...?", "answer": "ADAM", "direction": "across", "row": 2, "col": 1 },
      { "id": 3, "number": 4, "clue": "Thiên Chúa dựng nên các loài vật và con người vào ngày thứ...?", "answer": "SAU", "direction": "down", "row": 1, "col": 1 },
      { "id": 6, "number": 5, "clue": "Thiên Chúa nghỉ ngơi và thánh hóa ngày thứ...?", "answer": "BAY", "direction": "across", "row": 4, "col": 0 },
      { "id": 5, "number": 6, "clue": "Người nữ đầu tiên được Thiên Chúa dựng nên là...?", "answer": "EVA", "direction": "across", "row": 0, "col": 0 }
    ],
    "gridRows": 5,
    "gridCols": 5
  },
  {
    "id": 2,
    "tier": 1,
    "title": "CÁC NHÂN VẬT CỰU ƯỚC",
    "keyword": "CỰU ƯỚC",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Vị tổ phụ được Thiên Chúa kêu gọi rời quê hương để trở thành cha của một dân lớn là...?",
        "answer": "APRAHAM",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Vị thủ lãnh được Chúa chọn để dẫn dắt dân Israel vượt qua Biển Đỏ rời khỏi Ai Cập là...?",
        "answer": "MOSE",
        "direction": "down",
        "row": 3,
        "col": 6
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Người con duy nhất được Ápraham đem đi hiến tế theo lệnh Chúa là...?",
        "answer": "ISAAC",
        "direction": "down",
        "row": 0,
        "col": 3
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Người con của Isaac đã vật lộn với thiên thần và là cha của 12 chi tộc Israel là...?",
        "answer": "GIACOP",
        "direction": "down",
        "row": 1,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Người bị các anh bán sang Ai Cập sau này trở thành tể tướng cứu sống gia đình là...?",
        "answer": "GIUSE",
        "direction": "across",
        "row": 1,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Người vâng lệnh Chúa đóng chiếc tàu lớn để cứu muôn loài khỏi trận Đại Hồng Thủy là...?",
        "answer": "NOE",
        "direction": "across",
        "row": 6,
        "col": 4
      }
    ],
    "gridRows": 7,
    "gridCols": 7
  },
  {
    "id": 3,
    "tier": 1,
    "title": "ĐỨC MARIA VÀ THÁNH GIUSE",
    "keyword": "THÁNH GIA",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Lời đáp trọn vẹn của Đức Maria trước sứ thần: “Này tôi là tôi tớ Chúa, tôi...”",
        "answer": "XINVANG",
        "direction": "across",
        "row": 8,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Tổng lãnh thiên thần được Thiên Chúa sai đến truyền tin cho Đức Mẹ tên là...?",
        "answer": "GABRIEN",
        "direction": "down",
        "row": 2,
        "col": 5
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Người công chính, bạn trăm năm của Đức Mẹ và là cha nuôi của Chúa Giêsu là...?",
        "answer": "GIUSE",
        "direction": "down",
        "row": 1,
        "col": 3
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Đức Maria đã lên đường viếng thăm và chúc mừng người chị họ tên là...?",
        "answer": "ELISABET",
        "direction": "across",
        "row": 4,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Cả Đức Maria và Thánh Giuse đều thuộc dòng dõi vua...?",
        "answer": "DAVIT",
        "direction": "down",
        "row": 0,
        "col": 7
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nơi Chúa Giêsu sinh ra trong máng cỏ thuộc miền Giuđê là thành...?",
        "answer": "BELEM",
        "direction": "down",
        "row": 2,
        "col": 1
      }
    ],
    "gridRows": 9,
    "gridCols": 8
  },
  {
    "id": 4,
    "tier": 1,
    "title": "NHỮNG LỜI ĐẦU TIÊN CỦA CHÚA GIÊSU",
    "keyword": "TIN MỪNG",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Trước khi rao giảng, Chúa Giêsu vào hoang địa ăn chay cầu nguyện trong bao nhiêu ngày đêm?",
        "answer": "BONMUOI",
        "direction": "down",
        "row": 2,
        "col": 6
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Lời kêu gọi đầu tiên trong sứ vụ của Chúa Giêsu: “Thời kỳ đã mãn, anh em hãy... và tin vào Tin Mừng.”",
        "answer": "SAMHOI",
        "direction": "across",
        "row": 8,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Chúa Giêsu cất tiếng mời gọi các môn đệ đầu tiên: “Hãy theo...?”",
        "answer": "THAY",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Chúa Giêsu phán: “Hãy theo Thầy, Thầy sẽ làm cho các anh thành những kẻ...”",
        "answer": "LUOINGUOI",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Điều răn mới Chúa Giêsu trao ban: “Anh em hãy yêu thương nhau như Thầy đã... anh em.”",
        "answer": "YEUTHUONG",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Trong Tám Mối Phúc, những người có tâm hồn nghèo khó được Chúa gọi là người có...?",
        "answer": "PHUC",
        "direction": "down",
        "row": 1,
        "col": 2
      }
    ],
    "gridRows": 9,
    "gridCols": 9
  },
  {
    "id": 5,
    "tier": 1,
    "title": "NHỮNG MÔN ĐỆ ĐẦU TIÊN",
    "keyword": "MÔN ĐỆ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Nghề nghiệp sinh nhai của anh em Phêrô và Gioan bên bờ hồ Galilê trước khi theo Chúa là...?",
        "answer": "DANHCA",
        "direction": "across",
        "row": 3,
        "col": 1
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Người anh em ruột đã dẫn Simon Phêrô đến gặp Chúa Giêsu là...?",
        "answer": "ANRE",
        "direction": "down",
        "row": 3,
        "col": 6
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Vị môn đệ từng ngồi ở bàn thu thuế trước khi đáp lại tiếng Chúa gọi là...?",
        "answer": "MATTHEU",
        "direction": "across",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Người tông đồ phản bội nộp Thầy mình với giá ba mươi đồng bạc là...?",
        "answer": "GIUDA",
        "direction": "across",
        "row": 8,
        "col": 1
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Vị tông đồ trưởng đã chối Thầy ba lần nhưng sau đó ăn năn khóc lóc là...?",
        "answer": "PHERO",
        "direction": "down",
        "row": 2,
        "col": 4
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Vị tông đồ đòi xỏ ngón tay vào lỗ đinh mới chịu tin Chúa phục sinh là...?",
        "answer": "TOMA",
        "direction": "down",
        "row": 0,
        "col": 2
      }
    ],
    "gridRows": 9,
    "gridCols": 7
  },
  {
    "id": 6,
    "tier": 1,
    "title": "NHỮNG CUỘC GẶP GỠ VỚI CHÚA GIÊSU",
    "keyword": "GẶP GỠ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Chúa Giêsu trò chuyện về Nước Hằng Sống với người phụ nữ Samari bên bờ giếng...?",
        "answer": "GIACOP",
        "direction": "across",
        "row": 10,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Ông trưởng nhóm thu thuế có vóc dáng thấp bé đã trèo lên cây sung để thấy Chúa là...?",
        "answer": "DAKEU",
        "direction": "across",
        "row": 8,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Người bạn ở Bêtania đã chết bốn ngày được Chúa gọi bước ra khỏi mộ là...?",
        "answer": "LADARO",
        "direction": "across",
        "row": 5,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Người hành khất mù lòa bên vệ đường Giêrikhô kêu xin và được Chúa mở mắt là...?",
        "answer": "BARTIME",
        "direction": "across",
        "row": 1,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Cụ già đạo đức Simêon bồng ẵm Hài Nhi Giêsu và cất lời tạ ơn tại khuôn viên...?",
        "answer": "DENTHO",
        "direction": "down",
        "row": 0,
        "col": 6
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Người phụ nữ được Chúa trừ bảy quỷ và là người đầu tiên gặp Chúa Phục Sinh là Maria...?",
        "answer": "MAGDALENA",
        "direction": "down",
        "row": 0,
        "col": 1
      }
    ],
    "gridRows": 11,
    "gridCols": 7
  },
  {
    "id": 7,
    "tier": 1,
    "title": "CÁC PHÉP LẠ",
    "keyword": "PHÉP LẠ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Phép lạ đầu tiên tại Cana: Chúa Giêsu đã biến nước lã thành...?",
        "answer": "RUOU",
        "direction": "across",
        "row": 9,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Khi đi thuyền gặp cuồng phong trên biển hồ, Chúa Giêsu đã truyền cho bão tố phải...?",
        "answer": "YENLANG",
        "direction": "across",
        "row": 5,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Trước khi chữa lành đôi chân cho người bại liệt, Chúa Giêsu đã ban ơn tha...?",
        "answer": "TOI",
        "direction": "down",
        "row": 8,
        "col": 2
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Số lượng chiếc bánh Chúa dùng để làm phép lạ nuôi năm ngàn người ăn no nê là...?",
        "answer": "NAM",
        "direction": "across",
        "row": 1,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Khi gặp sóng gió dập dồn, các môn đệ hoảng sợ kêu lên: “Thầy ơi, chúng ta... mất!”",
        "answer": "CHET",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nhờ đức tin vững vàng của viên đại đội trưởng, người đầy tớ của ông ở nhà đã được...?",
        "answer": "LANHBENH",
        "direction": "down",
        "row": 0,
        "col": 1
      }
    ],
    "gridRows": 11,
    "gridCols": 7
  },
  {
    "id": 8,
    "tier": 1,
    "title": "PHỤC SINH",
    "keyword": "PHỤC SINH",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Chúa Giêsu trỗi dậy từ cõi chết vào ngày đầu tuần, tức ngày thứ...?",
        "answer": "NHAT",
        "direction": "down",
        "row": 1,
        "col": 3
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Bà Maria Mácđala ra viếng mộ từ sáng sớm và hốt hoảng thấy tảng đá che cửa mộ đã bị...?",
        "answer": "LANRA",
        "direction": "down",
        "row": 0,
        "col": 6
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Vị thiên thần ngồi trên tảng đá nói với các phụ nữ: “Người đã... rồi, không còn ở đây nữa.”",
        "answer": "SONGLAI",
        "direction": "across",
        "row": 1,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Hai môn đệ buồn bã rời Giêrusalem và được Chúa đồng hành trên đường về làng...?",
        "answer": "EMMAU",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Lời chào chúc đầu tiên Chúa trao gửi các môn đệ mỗi khi hiện ra: “Bình... cho anh em.”",
        "answer": "AN",
        "direction": "down",
        "row": 1,
        "col": 6
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Khi bẻ bánh trước mặt hai môn đệ Emmâu, mắt họ liền mở ra và nhận ra Người nhờ...?",
        "answer": "DUCTIN",
        "direction": "across",
        "row": 6,
        "col": 0
      }
    ],
    "gridRows": 7,
    "gridCols": 8
  },
  {
    "id": 9,
    "tier": 1,
    "title": "CUỘC THƯƠNG KHÓ",
    "keyword": "THƯƠNG KHÓ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Chúa Giêsu tiến vào Giêrusalem trong sự hoan hô của dân chúng khi ngồi trên lưng con...?",
        "answer": "LUA",
        "direction": "down",
        "row": 3,
        "col": 2
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Trong Bữa Tiệc Ly, trước khi trao Bánh và Rượu cho môn đệ, Chúa Giêsu dâng lời chúc tụng và...?",
        "answer": "TAON",
        "direction": "across",
        "row": 7,
        "col": 3
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Chúa Giêsu cầu nguyện đổ mồ hôi máu trong đêm bị bắt tại vườn cây dầu mang tên...?",
        "answer": "GHETSEMANI",
        "direction": "down",
        "row": 0,
        "col": 4
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Giuđa Ítcariốt dùng dấu hiệu gì để điểm mặt chỉ điểm Chúa cho quân lính?",
        "answer": "NUHON",
        "direction": "across",
        "row": 1,
        "col": 2
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Quan tổng trấn Rôma rửa tay phủi trách nhiệm rồi trao Chúa Giêsu cho dân đem đi đóng đinh là...?",
        "answer": "PILATO",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Dụng cụ khổ hình mà Chúa Giêsu vác trên vai lên đồi Golgotha là cây...?",
        "answer": "THAPGIA",
        "direction": "down",
        "row": 0,
        "col": 0
      }
    ],
    "gridRows": 10,
    "gridCols": 7
  },
  {
    "id": 10,
    "tier": 2,
    "title": "CHÚA THÁNH THẦN",
    "keyword": "NGŨ TUẦN",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Chúa Thánh Thần hiện xuống tràn ngập trên Đức Mẹ và các tông đồ vào ngày đại lễ...?",
        "answer": "NGUTUAN",
        "direction": "across",
        "row": 5,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Một trong những hình ảnh hữu hình diễn tả Thánh Thần đậu xuống trên từng người là hình lưỡi...?",
        "answer": "LUA",
        "direction": "across",
        "row": 7,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Sau khi nhận lãnh Thánh Thần, các tông đồ thoát khỏi sợ hãi và mạnh dạn ra đi loan báo...?",
        "answer": "TINMUNG",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Chúa Giêsu hứa sai Đấng Bảo Trợ đến để soi sáng và nhắc lại mọi lời Người đã...?",
        "answer": "DAY",
        "direction": "down",
        "row": 4,
        "col": 5
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Trong mầu nhiệm Một Chúa Ba Ngôi, Chúa Thánh Thần là Ngôi thứ...?",
        "answer": "BA",
        "direction": "across",
        "row": 2,
        "col": 2
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Tên gọi tước hiệu của Ngôi Ba Thiên Chúa mà chúng ta tuyên xưng là Chúa...?",
        "answer": "THANHTHAN",
        "direction": "down",
        "row": 0,
        "col": 3
      }
    ],
    "gridRows": 9,
    "gridCols": 7
  },
  {
    "id": 11,
    "tier": 2,
    "title": "MƯỜI ĐIỀU RĂN",
    "keyword": "ĐIỀU RĂN",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Điều răn thứ nhất dạy người tín hữu phải kính mến và thờ phượng một mình...?",
        "answer": "THIENCHUA",
        "direction": "across",
        "row": 2,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Điều răn thứ hai nghiêm cấm việc kêu Danh Đức Chúa Trời cách...?",
        "answer": "VOCO",
        "direction": "across",
        "row": 0,
        "col": 5
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Điều răn thứ ba truyền dạy việc thánh hóa và nghỉ việc xác vào ngày...?",
        "answer": "CHUANHAT",
        "direction": "down",
        "row": 0,
        "col": 7
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Bổn phận của con cái đối với các bậc sinh thành được tóm gọn: “Thảo kính...”",
        "answer": "CHAME",
        "direction": "down",
        "row": 2,
        "col": 5
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Điều răn thứ năm bảo vệ phẩm giá và sự sống con người: “Chớ...”",
        "answer": "GIETNGUOI",
        "direction": "down",
        "row": 0,
        "col": 3
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Điều răn thứ bảy bảo vệ quyền sở hữu của tha nhân: “Chớ...”",
        "answer": "TROMCAP",
        "direction": "down",
        "row": 2,
        "col": 0
      }
    ],
    "gridRows": 9,
    "gridCols": 9
  },
  {
    "id": 12,
    "tier": 2,
    "title": "BẢY BÍ TÍCH",
    "keyword": "BÍ TÍCH",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Bí tích cửa ngõ tái sinh chúng ta làm con Thiên Chúa và gia nhập Hội Thánh là...?",
        "answer": "RUATOI",
        "direction": "down",
        "row": 1,
        "col": 8
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Bí tích kiện toàn ân sủng Phép Rửa và ghi dấu ấn thiêng liêng Chúa Thánh Thần là...?",
        "answer": "THEMSUC",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Bí tích nguồn mạch và tột đỉnh đời sống Kitô giáo, trao ban chính Thịt Máu Chúa là...?",
        "answer": "THANHTHE",
        "direction": "across",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Bí tích tha thứ các tội ta phạm sau Phép Rửa và giao hòa ta với Chúa là...?",
        "answer": "HOAGIAI",
        "direction": "across",
        "row": 6,
        "col": 2
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Bí tích ban ơn nâng đỡ sức mạnh thiêng liêng cho các bệnh nhân hiểm nghèo là...?",
        "answer": "XUCDAU",
        "direction": "down",
        "row": 2,
        "col": 4
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Bí tích tác tạo giao ước hôn nhân thánh thiện giữa một người nam và một người nữ là...?",
        "answer": "HONPHOI",
        "direction": "down",
        "row": 0,
        "col": 6
      }
    ],
    "gridRows": 8,
    "gridCols": 9
  },
  {
    "id": 13,
    "tier": 2,
    "title": "KINH TIN KÍNH",
    "keyword": "ĐỨC TIN",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Lời mở đầu bản tuyên tín: “Tôi tin kính một Thiên Chúa là... toàn năng.”",
        "answer": "CHA",
        "direction": "across",
        "row": 4,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Chúa Con xuống thế làm người bởi phép Chúa Thánh Thần và sinh bởi Trinh Nữ...?",
        "answer": "MARIA",
        "direction": "down",
        "row": 0,
        "col": 2
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Bản tuyên xưng đức tin ghi rõ biến cố Chúa Giêsu chịu khổ hình dưới thời tổng trấn...?",
        "answer": "PILATO",
        "direction": "down",
        "row": 2,
        "col": 4
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Sau khi chịu chết và an táng, Người đã sống lại như lời Kinh Thánh vào ngày thứ...?",
        "answer": "BA",
        "direction": "across",
        "row": 1,
        "col": 1
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Sau khi phục sinh, Chúa Giêsu hoàn tất công cuộc ở trần gian và ngự lên...?",
        "answer": "TROI",
        "direction": "down",
        "row": 6,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Bốn đặc tính của Hội Thánh: Duy nhất, Thánh thiện, Công giáo và...?",
        "answer": "TONGTRUYEN",
        "direction": "across",
        "row": 6,
        "col": 0
      }
    ],
    "gridRows": 10,
    "gridCols": 10
  },
  {
    "id": 14,
    "tier": 2,
    "title": "NHỮNG KINH CẦU NGUYỆN CĂN BẢN",
    "keyword": "CẦU NGUYỆN",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Trong Kinh Kính Mừng, chúng ta lặp lại lời sứ thần chào Mẹ: “Kính mừng Maria đầy...”",
        "answer": "ONPHUC",
        "direction": "down",
        "row": 0,
        "col": 4
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Lời kinh tuyệt hảo chính Chúa Giêsu trực tiếp dạy các tông đồ cầu nguyện là Kinh...?",
        "answer": "LAYCHA",
        "direction": "across",
        "row": 5,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Bản kinh tóm tắt cốt lõi những tín điều mà mọi Kitô hữu phải tuyên xưng là Kinh...?",
        "answer": "TINKINH",
        "direction": "down",
        "row": 1,
        "col": 8
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Kinh tôn vinh Ba Ngôi Thiên Chúa thường đọc kết thúc mỗi chục hạt Mân Côi là Kinh...?",
        "answer": "SANGDANH",
        "direction": "across",
        "row": 7,
        "col": 1
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Khi làm dấu Thánh Giá, người tín hữu tuyên xưng: “Nhân danh Cha, và Con, và...”",
        "answer": "THANHTHAN",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Lời khẩn xin trong Kinh Lạy Cha: “Và tha nợ chúng con như chúng con cũng tha kẻ có... chúng con.”",
        "answer": "NO",
        "direction": "across",
        "row": 1,
        "col": 4
      }
    ],
    "gridRows": 8,
    "gridCols": 9
  },
  {
    "id": 15,
    "tier": 2,
    "title": "BA NHÂN ĐỨC ĐỐI THẦN",
    "keyword": "NHÂN ĐỨC",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Nhân đức siêu nhiên thúc đẩy ta đón nhận và vâng phục Lời Mặc Khải của Chúa là đức...?",
        "answer": "TIN",
        "direction": "down",
        "row": 0,
        "col": 3
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Nhân đức giúp ta vững lòng phó thác và khao khát hạnh phúc Nước Trời mai sau là đức...?",
        "answer": "CAY",
        "direction": "across",
        "row": 4,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Nhân đức cao trọng nhất, liên kết ta với Thiên Chúa và phục vụ tha nhân vô điều kiện là đức...?",
        "answer": "MEN",
        "direction": "across",
        "row": 2,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Thánh Phaolô khẳng định trong ba nhân đức: “Đức tin, đức cậy, đức mến; nhưng đức lớn nhất là đức...”",
        "answer": "BACAI",
        "direction": "across",
        "row": 6,
        "col": 1
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Các nhân đức này được gọi là \"đối thần\" vì có nguồn gốc, đối tượng và cùng đích là chính...?",
        "answer": "THIENCHUA",
        "direction": "down",
        "row": 4,
        "col": 5
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Hạt giống của ba nhân đức đối thần được Chúa gieo vào linh hồn khi ta lãnh Bí tích...?",
        "answer": "RUATOI",
        "direction": "across",
        "row": 0,
        "col": 0
      }
    ],
    "gridRows": 13,
    "gridCols": 6
  },
  {
    "id": 16,
    "tier": 2,
    "title": "BỐN NHÂN ĐỨC TRỤ",
    "keyword": "BẢN LỀ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Nhân đức soi sáng lý trí nhận ra điều tốt thật sự để chọn lựa phương tiện thích hợp là...?",
        "answer": "KHONNGOAN",
        "direction": "across",
        "row": 2,
        "col": 1
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Ý chí kiên quyết và bất biến muốn trả lại cho Thiên Chúa và tha nhân những gì thuộc về họ là đức...?",
        "answer": "CONGBANG",
        "direction": "down",
        "row": 1,
        "col": 7
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Nhân đức bảo đảm sự vững vàng và kiên trì theo đuổi điều thiện giữa mọi thử thách gian nan là đức...?",
        "answer": "CANDAM",
        "direction": "down",
        "row": 0,
        "col": 9
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Nhân đức giúp làm chủ bản năng, điều hòa các ham muốn khoái lạc và sống chừng mực là đức...?",
        "answer": "TIETDO",
        "direction": "across",
        "row": 0,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Bốn nhân đức trụ giữ vai trò rường cột tựa như chiếc \"bản lề\" giúp xoay chuyển toàn bộ đời sống...?",
        "answer": "LUANLY",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Khi một người kiên trì rèn luyện thói quen làm điều thiện qua các nhân đức, người đó dần đạt tới sự...?",
        "answer": "TRONLANH",
        "direction": "down",
        "row": 0,
        "col": 3
      }
    ],
    "gridRows": 9,
    "gridCols": 10
  },
  {
    "id": 17,
    "tier": 2,
    "title": "BẢY VIỆC THƯƠNG NGƯỜI VỀ PHẦN XÁC",
    "keyword": "THƯƠNG XÁC",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Trước người lâm cảnh đói rách, mối thương xác đầu tiên dạy: “Thương kẻ đói cho...”",
        "answer": "AN",
        "direction": "down",
        "row": 0,
        "col": 1
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Mối thương xót chia sẻ giọt nước mát cho người khát: “Thương kẻ khát cho...”",
        "answer": "UONG",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Mối thương người giúp che thân cho kẻ thiếu thốn vải vóc: “Thương kẻ rách cho...”",
        "answer": "MAC",
        "direction": "across",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Mối bác ái nâng đỡ tinh thần người ốm yếu liệt giường: “Kẻ liệt kẻ khốn thì...”",
        "answer": "VIENG",
        "direction": "across",
        "row": 5,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Mở rộng cánh cửa đón tiếp người xa cơ lỡ bước cơ nhỡ: “Thương kẻ khách cho đỗ...”",
        "answer": "TRO",
        "direction": "down",
        "row": 7,
        "col": 3
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nghĩa cử nhân văn cuối cùng dành cho người qua đời: “Chôn cất kẻ...”",
        "answer": "CHET",
        "direction": "across",
        "row": 7,
        "col": 0
      }
    ],
    "gridRows": 10,
    "gridCols": 5
  },
  {
    "id": 18,
    "tier": 2,
    "title": "BẢY VIỆC THƯƠNG NGƯỜI VỀ PHẦN HỒN",
    "keyword": "THƯƠNG HỒN",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Giúp người xung quanh nhận biết giáo lý và chân lý đúng đắn: “Mở dạy kẻ...”",
        "answer": "MEMUOI",
        "direction": "across",
        "row": 5,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Định hướng và dẫn dắt người đang phân vân trước sự dữ: “Lấy lời lành mà... người.”",
        "answer": "KHUYEN",
        "direction": "down",
        "row": 1,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Sửa chữa thái độ sai quấy và kéo người lầm lạc trở về: “Răn bảo kẻ...”",
        "answer": "COTOI",
        "direction": "down",
        "row": 1,
        "col": 8
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Rộng lòng bỏ qua xúc phạm và không nuôi lòng báo thù: “Tha kẻ dể ta” nghĩa là...?",
        "answer": "THATHU",
        "direction": "down",
        "row": 0,
        "col": 3
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Mang niềm hy vọng và lau khô nước mắt người cùng khổ: “Yên ủi kẻ...”",
        "answer": "AULO",
        "direction": "across",
        "row": 2,
        "col": 5
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nghĩa hiệp thông sau cùng: “Cầu cho kẻ sống và kẻ...”",
        "answer": "QUADOI",
        "direction": "down",
        "row": 0,
        "col": 5
      }
    ],
    "gridRows": 7,
    "gridCols": 9
  },
  {
    "id": 19,
    "tier": 2,
    "title": "TÁM MỐI PHÚC THẬT",
    "keyword": "HẠNH PHÚC",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Phúc thay ai có tinh thần... vì Nước Trời là của họ.",
        "answer": "NGHEOKHO",
        "direction": "down",
        "row": 1,
        "col": 3
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Phúc thay ai sống... vì họ sẽ được Đất Hứa làm gia nghiệp.",
        "answer": "HIENLANH",
        "direction": "down",
        "row": 3,
        "col": 7
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Phúc thay ai đang phải khóc than vì họ sẽ được Thiên Chúa ủi an và ban...?",
        "answer": "NIEMVUI",
        "direction": "across",
        "row": 4,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Phúc thay ai biết xót thương người vì họ sẽ được Thiên Chúa...?",
        "answer": "THUONGXOT",
        "direction": "down",
        "row": 0,
        "col": 1
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Phúc thay ai có tâm hồn trong sạch vì họ sẽ được nhìn ngắm...?",
        "answer": "NHANCHUA",
        "direction": "across",
        "row": 1,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Phúc thay ai xây dựng... vì họ sẽ được gọi là con Thiên Chúa.",
        "answer": "HOABINH",
        "direction": "across",
        "row": 10,
        "col": 1
      }
    ],
    "gridRows": 11,
    "gridCols": 8
  },
  {
    "id": 20,
    "tier": 3,
    "title": "HOA QUẢ CHÚA THÁNH THẦN",
    "keyword": "HOA QUẢ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Niềm vui thánh thiện, sâu xa phát sinh từ tâm hồn gắn kết với Chúa là hoa quả...?",
        "answer": "HOANLAC",
        "direction": "down",
        "row": 1,
        "col": 2
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Tình trạng tâm hồn tĩnh lặng, hòa giải với Chúa và tha nhân là hoa quả...?",
        "answer": "BINHAN",
        "direction": "down",
        "row": 0,
        "col": 4
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Sự bền chí chịu đựng thử thách và nghịch cảnh mà không oán than là hoa quả...?",
        "answer": "NHANNHUC",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Lòng nhân từ, luôn mong muốn và thi hành điều tốt lành cho người khác là hoa quả...?",
        "answer": "NHANHAU",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Đức tính kiên định, trước sau như một trong các lời hứa và bổn phận là hoa quả...?",
        "answer": "TRUNGTIN",
        "direction": "down",
        "row": 1,
        "col": 6
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Năng lực kiềm chế các ham muốn tự nhiên để sống thanh thoát là hoa quả...?",
        "answer": "TIETDO",
        "direction": "across",
        "row": 9,
        "col": 0
      }
    ],
    "gridRows": 10,
    "gridCols": 7
  },
  {
    "id": 21,
    "tier": 3,
    "title": "NĂM ĐIỀU RĂN HỘI THÁNH",
    "keyword": "GIÁO HỘI",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Điều răn thứ nhất: Dự lễ các ngày Chúa Nhật cùng các ngày Lễ...?",
        "answer": "BUOC",
        "direction": "down",
        "row": 1,
        "col": 2
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Điều răn thứ hai buộc người tín hữu phải xưng tội trong một năm ít là một...?",
        "answer": "LAN",
        "direction": "down",
        "row": 0,
        "col": 6
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Điều răn thứ ba truyền dạy người tín hữu rước Mình Thánh Chúa ít là trong Mùa...?",
        "answer": "PHUCSINH",
        "direction": "across",
        "row": 2,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Điều răn thứ tư dạy giữ luật chay tịnh và kiêng cữ món gì vào các ngày luật định?",
        "answer": "THIT",
        "direction": "down",
        "row": 4,
        "col": 3
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Điều răn thứ năm nhắc nhở bổn phận đóng góp vật chất để nâng đỡ công việc của...?",
        "answer": "HOITHANH",
        "direction": "across",
        "row": 7,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Việc tuân giữ năm điều răn Hội Thánh giúp người Kitô hữu biểu lộ lòng trung thành với...?",
        "answer": "DUCTIN",
        "direction": "across",
        "row": 4,
        "col": 0
      }
    ],
    "gridRows": 8,
    "gridCols": 8
  },
  {
    "id": 22,
    "tier": 3,
    "title": "NĂM PHỤNG VỤ",
    "keyword": "PHỤNG VỤ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Mùa bốn tuần chuẩn bị tâm hồn đón mừng biến cố Con Thiên Chúa giáng trần là Mùa...?",
        "answer": "VONG",
        "direction": "across",
        "row": 3,
        "col": 5
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Mùa lễ hội mừng niềm vui Ngôi Lời nhập thể làm người ở cùng chúng ta là Mùa...?",
        "answer": "GIANGSINH",
        "direction": "across",
        "row": 7,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Mùa bốn mươi ngày ăn chay, hãm mình và cầu nguyện để chuẩn bị mừng lễ Vượt Qua là Mùa...?",
        "answer": "CHAY",
        "direction": "across",
        "row": 1,
        "col": 5
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Mùa cử hành biến cố Chúa Phục Sinh khải hoàn kéo dài năm mươi ngày là Mùa...?",
        "answer": "PHUCSINH",
        "direction": "across",
        "row": 9,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Mùa phụng vụ gồm 33 hoặc 34 tuần suy niệm cuộc đời công khai của Chúa là Mùa...?",
        "answer": "THUONGNIEN",
        "direction": "down",
        "row": 0,
        "col": 6
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Đỉnh cao của Năm Phụng Vụ bắt đầu từ chiều Thứ Năm Tuần Thánh là Tam Nhật...?",
        "answer": "VUOTQUA",
        "direction": "down",
        "row": 1,
        "col": 2
      }
    ],
    "gridRows": 10,
    "gridCols": 9
  },
  {
    "id": 23,
    "tier": 3,
    "title": "NHỮNG DẤU CHỈ TRONG NHÀ THỜ",
    "keyword": "NHÀ THỜ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Khu vực trang trọng nhất trên cao nơi đặt bàn thờ để cử hành Thánh Lễ gọi là...?",
        "answer": "CUNGTHANH",
        "direction": "across",
        "row": 4,
        "col": 3
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Bục cao dành riêng để công bố Lời Chúa và diễn giảng trong phụng vụ gọi là...?",
        "answer": "GIANGDAI",
        "direction": "down",
        "row": 0,
        "col": 6
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Vật dụng kim loại quý dùng để chứa đựng Bánh Thánh đã truyền phép là...?",
        "answer": "BINHTHANH",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Chiếc tủ tôn kính đặt tại vị trí trung tâm để lưu giữ Mình Thánh Chúa gọi là...?",
        "answer": "NHATAM",
        "direction": "across",
        "row": 2,
        "col": 4
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Dấu chỉ trung tâm cứu độ luôn hiện diện trên bàn thờ hoặc cung thánh là cây...?",
        "answer": "THAPGIA",
        "direction": "down",
        "row": 1,
        "col": 1
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nơi linh thiêng trong nhà thờ dùng để cử hành nghi thức dìm nước ban sự sống mới là...?",
        "answer": "GIENGRUATOI",
        "direction": "across",
        "row": 0,
        "col": 2
      }
    ],
    "gridRows": 8,
    "gridCols": 13
  },
  {
    "id": 24,
    "tier": 3,
    "title": "CÁC BIỂU TƯỢNG CÔNG GIÁO",
    "keyword": "BIỂU TƯỢNG",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Biểu tượng căn cốt nhất nhắc nhớ tình yêu hiến mạng và sự cứu độ của Đức Kitô là...?",
        "answer": "THAPGIA",
        "direction": "across",
        "row": 7,
        "col": 1
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Con vật hiền lành hiến tế chuộc tội, biểu trưng cho tước hiệu của Chúa Giêsu là Con...?",
        "answer": "CHIEN",
        "direction": "across",
        "row": 5,
        "col": 1
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Hình ảnh loài chim bay là là trên sông Giođan tượng trưng cho Chúa Thánh Thần là chim...?",
        "answer": "BOCAU",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Ký hiệu chữ Hy Lạp ICHTHYS thời Hội Thánh sơ khai có nghĩa là hình con...?",
        "answer": "CA",
        "direction": "across",
        "row": 3,
        "col": 2
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Chất lỏng tinh khiết dùng trong Phép Rửa diễn tả sự thanh tẩy tội lỗi và tái sinh là...?",
        "answer": "NUOC",
        "direction": "down",
        "row": 0,
        "col": 2
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Lương thực hằng ngày trở thành Thịt và Máu Thánh Chúa nuôi sống linh hồn là Bánh và...?",
        "answer": "RUOU",
        "direction": "across",
        "row": 1,
        "col": 1
      }
    ],
    "gridRows": 8,
    "gridCols": 8
  },
  {
    "id": 25,
    "tier": 3,
    "title": "KINH THÁNH",
    "keyword": "KINH THÁNH",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Cuốn sách đầu tiên trong bộ Cựu Ước thuật lại công trình tạo dựng vũ trụ là sách...?",
        "answer": "SANGTHE",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Vị tổ phụ đức tin được Chúa gọi đi lập nghiệp và hứa ban dòng dõi đông như sao trên trời là...?",
        "answer": "APRAHAM",
        "direction": "across",
        "row": 1,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Vị thủ lãnh đã lên núi Sinai đón nhận Hai Bia Đá Mười Điều Răn từ Thiên Chúa là...?",
        "answer": "MOSE",
        "direction": "across",
        "row": 7,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Tập sách gồm 150 bài ca thánh vịnh du dương dùng trong kinh nguyện phụng vụ là sách...?",
        "answer": "THANHVINH",
        "direction": "across",
        "row": 4,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Bốn cuốn sách ghi lại cuộc đời, phép lạ và lời giảng dạy cứu độ của Chúa Giêsu gọi là...?",
        "answer": "TINMUNG",
        "direction": "down",
        "row": 2,
        "col": 7
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Cuốn sách khép lại toàn bộ quy điển Tân Ước viết về viễn cảnh cánh chung là sách...?",
        "answer": "KHAIHUYEN",
        "direction": "down",
        "row": 0,
        "col": 4
      }
    ],
    "gridRows": 9,
    "gridCols": 9
  },
  {
    "id": 26,
    "tier": 3,
    "title": "HỘI THÁNH SƠ KHAI",
    "keyword": "HIỆP THÔNG",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Biến cố khai sinh Hội Thánh truyền giáo diễn ra vào ngày lễ...?",
        "answer": "NGUTUAN",
        "direction": "down",
        "row": 0,
        "col": 1
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Thành phố đầu tiên nơi các môn đệ của Chúa Giêsu được gọi với tên \"Kitô hữu\" là...?",
        "answer": "ANTIOKIA",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Tông đồ trưởng được Chúa trao quyền cầm buộc và tháo cởi qua hình ảnh \"chìa khóa\" là...?",
        "answer": "PHERO",
        "direction": "across",
        "row": 1,
        "col": 4
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Vị sứ đồ nhiệt thành đã đi khắp Địa Trung Hải loan báo Tin Mừng cho Dân Ngoại là...?",
        "answer": "PHAOLO",
        "direction": "down",
        "row": 1,
        "col": 4
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Sinh hoạt căn bản của cộng đoàn tiên khởi: siêng năng nghe giảng, bẻ bánh và cùng nhau...?",
        "answer": "CAUNGUYEN",
        "direction": "across",
        "row": 3,
        "col": 3
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Tinh thần nổi bật khiến dân ngoại thán phục các Kitô hữu tiên khởi là tình yêu...?",
        "answer": "HUYNHDE",
        "direction": "down",
        "row": 0,
        "col": 11
      }
    ],
    "gridRows": 7,
    "gridCols": 12
  },
  {
    "id": 27,
    "tier": 3,
    "title": "CÁC THÁNH VÀ ƠN GỌI",
    "keyword": "NÊN THÁNH",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Vị thánh thành Assisi nổi tiếng yêu mến sự nghèo khó và muôn loài thụ tạo là thánh...?",
        "answer": "PHANXICO",
        "direction": "down",
        "row": 0,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Vị thánh sáng lập Dòng Giảng Thuyết (Dòng Đa Minh) với sứ mạng bảo vệ chân lý là thánh...?",
        "answer": "DAMINH",
        "direction": "down",
        "row": 5,
        "col": 2
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Nữ thánh trẻ tiến sĩ Hội Thánh nổi danh với “Con đường thơ ấu thiêng liêng” là Têrêsa Hài Đồng...?",
        "answer": "GIESU",
        "direction": "across",
        "row": 8,
        "col": 1
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Nữ thánh đồng hương và là người lập dòng nữ khó nghèo bên cạnh thánh Phanxicô là thánh...?",
        "answer": "CLARA",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Lời mời gọi phổ quát gửi đến mọi Kitô hữu bất kể bậc sống là lời mời gọi nên...?",
        "answer": "THANH",
        "direction": "across",
        "row": 10,
        "col": 1
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Con đường hay bậc sống mà Thiên Chúa đặt để riêng cho mỗi người nhằm phục vụ là một...?",
        "answer": "ONGOI",
        "direction": "across",
        "row": 12,
        "col": 0
      }
    ],
    "gridRows": 13,
    "gridCols": 6
  },
  {
    "id": 28,
    "tier": 3,
    "title": "LỊCH SỬ HỘI THÁNH",
    "keyword": "LỊCH SỬ",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Kinh đô đế quốc nơi hai thánh tông đồ Phêrô và Phaolô tử đạo, nay là trung tâm Công giáo là...?",
        "answer": "ROMA",
        "direction": "across",
        "row": 3,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Chiếu chỉ Milan ban hành năm 313 đã đem lại cho Kitô giáo quyền tự do...?",
        "answer": "TONGIAO",
        "direction": "down",
        "row": 2,
        "col": 8
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Công đồng chung đầu tiên năm 325 bảo vệ tín điều Chúa Kitô đồng bản thể với Chúa Cha họp tại...?",
        "answer": "NICEA",
        "direction": "down",
        "row": 4,
        "col": 4
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Công đồng canh tân mục vụ vĩ đại của thế kỷ 20 mở ra cuộc đối thoại với trần thế là Công đồng...?",
        "answer": "VATICANII",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Vị Giám mục Rôma kế vị thánh Phêrô, là chủ chăn hữu hình của Hội Thánh hoàn vũ là Đức...?",
        "answer": "GIAOHOANG",
        "direction": "down",
        "row": 0,
        "col": 1
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Thể chế tập hợp các Giám mục toàn cầu dưới sự chủ tọa của Giáo hoàng để quyết định việc chung là...?",
        "answer": "CONGDONG",
        "direction": "down",
        "row": 0,
        "col": 6
      }
    ],
    "gridRows": 9,
    "gridCols": 9
  },
  {
    "id": 29,
    "tier": 3,
    "title": "NHỮNG CÂU HỎI TÌNH HUỐNG & SUY LUẬN",
    "keyword": "BÁC ÁI",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Bạn trót nói lời xúc phạm khiến em buồn nhưng đã nhận lỗi, thái độ Chúa muốn em làm là...?",
        "answer": "THATHU",
        "direction": "across",
        "row": 0,
        "col": 0
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Thấy một người yếu thế bị ức hiếp hay bắt nạt, hành động đúng đắn của em là đứng ra bênh vực và...?",
        "answer": "BAOVE",
        "direction": "across",
        "row": 2,
        "col": 2
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Khi nhặt được của rơi ở trường hay ngoài đường, hành vi công bằng cần thực hiện là tìm cách...?",
        "answer": "TRALAI",
        "direction": "down",
        "row": 0,
        "col": 3
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Trước nỗi đau mất mát của một người bạn, việc em có thể làm ngay là lắng nghe và nói lời...?",
        "answer": "ANUI",
        "direction": "across",
        "row": 5,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Khi lỡ phạm điều sai quấy nghịch cùng Chúa và tha nhân, bước đầu tiên để làm lại là thật lòng...?",
        "answer": "SAMHOI",
        "direction": "down",
        "row": 4,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Nhìn thấy một người ăn xin rách rưới, thay vì xua đuổi, tâm hồn người Kitô hữu được gợi lên lòng...?",
        "answer": "YEUTHUONG",
        "direction": "down",
        "row": 1,
        "col": 6
      }
    ],
    "gridRows": 10,
    "gridCols": 7
  },
  {
    "id": 30,
    "tier": 3,
    "title": "HÀNH TRÌNH THEO CHÚA GIÊSU",
    "keyword": "THEO CHÚA",
    "timeLimit": 150,
    "clues": [
      {
        "id": 1,
        "number": 1,
        "clue": "Người môn đệ đích thực không chỉ nghe suông Lời Chúa mà còn phải đem ra đời sống để...?",
        "answer": "THUCHANH",
        "direction": "down",
        "row": 0,
        "col": 2
      },
      {
        "id": 2,
        "number": 2,
        "clue": "Đòi hỏi tột cùng của đức bác ái Tin Mừng: “Hãy yêu... và cầu nguyện cho kẻ ngược đãi anh em.”",
        "answer": "KETHU",
        "direction": "down",
        "row": 2,
        "col": 4
      },
      {
        "id": 3,
        "number": 3,
        "clue": "Điều kiện theo Thầy: “Ai muốn theo Thầy, phải từ bỏ chính mình, vác... mình hằng ngày mà theo.”",
        "answer": "THAPGIA",
        "direction": "down",
        "row": 2,
        "col": 6
      },
      {
        "id": 4,
        "number": 4,
        "clue": "Bàn tiệc thiêng liêng ban Mình và Máu Chúa nuôi dưỡng linh hồn tín hữu trên đường lữ hành là...?",
        "answer": "THANHTHE",
        "direction": "down",
        "row": 1,
        "col": 0
      },
      {
        "id": 5,
        "number": 5,
        "clue": "Lệnh truyền trước khi Chúa về trời: “Anh em hãy đi khắp tứ phương loan báo... cho muôn dân.”",
        "answer": "TINMUNG",
        "direction": "across",
        "row": 6,
        "col": 0
      },
      {
        "id": 6,
        "number": 6,
        "clue": "Cùng đích và niềm hy vọng lớn nhất của người tín hữu sau hành trình trần thế là được hưởng sự sống...?",
        "answer": "DOIDOI",
        "direction": "across",
        "row": 10,
        "col": 0
      }
    ],
    "gridRows": 11,
    "gridCols": 7
  }
];
