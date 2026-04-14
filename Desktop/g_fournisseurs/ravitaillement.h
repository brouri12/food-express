#ifndef RAVITAILLEMENT_H
#define RAVITAILLEMENT_H

#include <QDialog>

namespace Ui {
class ravitaillement;
}

class ravitaillement : public QDialog
{
    Q_OBJECT

public:
    explicit ravitaillement(QWidget *parent = nullptr);
    ~ravitaillement();

private:
    Ui::ravitaillement *ui;
};

#endif // RAVITAILLEMENT_H
